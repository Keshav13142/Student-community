import prisma from "@/lib/prisma";
import Navbar from "@/src/components/Layout/navbar";
import { synthWave } from "@/src/theme";
import { deletePost, updatePost } from "@/src/utils/api-calls/posts";
import { createPostSchema, parseZodErrors } from "@/src/utils/zod_schemas";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { useMutation } from "@tanstack/react-query";
import CodeMirror from "@uiw/react-codemirror";
import { getServerSession } from "next-auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { BsFillImageFill } from "react-icons/bs";
import { HiOutlineUpload } from "react-icons/hi";
import { IoSaveSharp } from "react-icons/io5";
import { MdDeleteForever, MdOutlineCategory, MdTitle } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";
import { authOptions } from "../../api/auth/[...nextauth]";

export async function getServerSideProps({ req, res, query }) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const { user } = session;

  const allCategories = await prisma.category.findMany({});

  const post = await prisma.post.findUnique({
    where: {
      id: query.slug,
    },
    select: {
      id: true,
      slug: true,
      published: true,
      bannerImage: true,
      categories: true,
      content: true,
      title: true,
      author: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!post || post.author.id !== user.id) {
    return {
      redirect: {
        destination: "/blog",
        permanent: false,
      },
    };
  }

  return {
    props: {
      post,
      allCategories,
    },
  };
}

const fields = [
  {
    name: "title",
    rightElement: <MdTitle />,
    placeholder: "Post title",
  },
  {
    name: "bannerImage",
    rightElement: <BsFillImageFill />,
    placeholder: "Banner image",
  },
];

const CreateNewPost = ({ post, allCategories }) => {
  const toast = useToast();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const [inputs, setInputs] = useState({
    title: post.title,
    bannerImage: post.bannerImage,
    content: post.content,
    categoryId: post.categories.length !== 0 ? post.categories[0].id : "",
    newCategory: "",
    publish: post.published,
  });

  const [errors, setErrors] = useState({
    title: null,
    bannerImage: null,
    content: null,
    categoryId: null,
    newCategory: null,
    publish: null,
  });

  const updateMutation = useMutation(updatePost, {
    onError: (error) => {
      console.log(error);
      toast({
        title: "Unable to update post",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
    onSuccess: ({ redirect, message }) => {
      toast({
        title: message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      router.push(redirect);
    },
  });

  const deleteMutation = useMutation(deletePost, {
    onError: (error) => {
      console.log(error);
      toast({
        title: "Unable to delete post",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
    onSuccess: ({ redirect, message }) => {
      toast({
        title: message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      router.push(redirect);
    },
  });

  const handleInputChange = ({ target: { value, name } }) => {
    setInputs((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "newCategory" ? { categoryId: null } : {}),
    }));
    setErrors((p) => ({ ...p, [name]: null }));
  };

  const handleCreate = () => {
    // Check the form inputs for error
    let parsedInputs = createPostSchema.safeParse(inputs);

    // Map through the errors and get then in the right format
    if (!parsedInputs.success) {
      setErrors((p) => ({ ...p, ...parseZodErrors(parsedInputs) }));
      return;
    }

    updateMutation.mutate({ ...inputs, postId: post.id });
  };

  return (
    <>
      <Head>
        <title>Edit Draft</title>
        <meta
          name="description"
          content="Platform for students within institutions to interact"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Post
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can&apos;t undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                isLoading={deleteMutation.isLoading}
                colorScheme="red"
                onClick={() => {
                  deleteMutation.mutate(post.id);
                }}
                ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <div className="min-h-screen">
        <Navbar />
        <main className="flex py-10 justify-center gap-20 flex-col lg:flex-row items-center lg:items-start">
          <div className="flex flex-col min-w-[55%] max-w-3xl lg:max-w-[60%] gap-10 order-2 lg:order-1">
            {fields.map((f, idx) => (
              <InputGroup key={idx} className="flex flex-col">
                <Input
                  value={inputs[f.name]}
                  name={f.name}
                  placeholder={f.placeholder}
                  focusBorderColor="purple.400"
                  borderColor="purple.200"
                  onChange={handleInputChange}
                />
                {f.rightElement && (
                  <InputRightElement>{f.rightElement}</InputRightElement>
                )}
                <span className="text-red-400 mt-1">{errors[f.name]}</span>
              </InputGroup>
            ))}
            <Tabs variant="line" colorScheme="purple">
              <TabList>
                <Tab>Write</Tab>
                <Tab>Preview</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <CodeMirror
                    value={inputs.content}
                    width="100%"
                    minHeight="50vh"
                    minWidth="100%"
                    extensions={[
                      markdown({
                        base: markdownLanguage,
                        codeLanguages: languages,
                      }),
                    ]}
                    onChange={(value) =>
                      setInputs((prev) => ({ ...prev, content: value }))
                    }
                    className="border border-gray-300"
                  />
                </TabPanel>
                <TabPanel>
                  <article className="prose">
                    <ReactMarkdown
                      rehypePlugins={[remarkGfm]}
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || "");
                          return !inline && match ? (
                            <SyntaxHighlighter
                              wrapLines
                              style={synthWave}
                              showLineNumbers
                              language={match[1]}
                              PreTag="div"
                              {...props}>
                              {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}>
                      {inputs.content}
                    </ReactMarkdown>
                  </article>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>
          <div className="flex flex-col p-2 gap-5 lg:sticky lg:top-24 h-fit order-1 lg:order-2">
            <h2 className="text-xl self-center">Post options</h2>
            <InputGroup className="flex flex-col">
              <Input
                isDisabled={Boolean(inputs.categoryId)}
                value={inputs.newCategory}
                name="newCategory"
                placeholder={"Create a new category"}
                focusBorderColor="purple.400"
                borderColor="purple.200"
                onChange={handleInputChange}
              />
              <InputRightElement>
                <MdOutlineCategory />
              </InputRightElement>
              <span className="text-red-400 mt-1">{errors.newCategory}</span>
            </InputGroup>
            <Select
              value={inputs.categoryId}
              onChange={handleInputChange}
              name="categoryId"
              isDisabled={inputs.newCategory !== ""}
              placeholder="Choose a category"
              focusBorderColor="purple.400"
              borderColor="purple.200">
              {allCategories?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
            <div className="flex items-center gap-2">
              <span>Publish now</span>
              <Switch
                colorScheme="purple"
                isChecked={inputs.publish}
                onChange={(e) => {
                  setInputs((p) => ({ ...p, publish: e.target.checked }));
                }}
              />
            </div>
            <Button
              variant="outline"
              colorScheme="purple"
              isLoading={updateMutation.isLoading}
              leftIcon={inputs.publish ? <HiOutlineUpload /> : <IoSaveSharp />}
              onClick={handleCreate}>
              {inputs.publish ? "Publish" : "Save"}
            </Button>
            <Button
              variant="outline"
              colorScheme="red"
              leftIcon={<MdDeleteForever />}
              onClick={onOpen}>
              Delete
            </Button>
          </div>
        </main>
      </div>
    </>
  );
};

export default CreateNewPost;
