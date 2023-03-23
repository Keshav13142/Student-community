import { deletePost, updatePost } from "@/lib/api-calls/posts";
import prisma from "@/lib/prisma";
import { createPostSchema, parseZodErrors } from "@/lib/validations";
import MarkdownEditor from "@/src/components/editor";
import RenderMarkdown from "@/src/components/render-markdown";
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
import { useMutation } from "@tanstack/react-query";
import { getServerSession } from "next-auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { BsFillImageFill } from "react-icons/bs";
import { HiOutlineUpload } from "react-icons/hi";
import { IoSaveSharp } from "react-icons/io5";
import { MdDeleteForever, MdOutlineCategory, MdTitle } from "react-icons/md";
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

const EditPost = ({ post, allCategories }) => {
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
    if (inputs.content.trim().length < 100) {
      toast({
        title: "Content must contain atleast 100 characters",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

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
        onClose={onClose}
      >
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
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <div>
        <div className="flex flex-col items-center justify-center gap-5 py-10 lg:flex-row lg:items-start xl:gap-10  2xl:gap-20">
          <div className="order-2 flex w-[90vw] flex-col gap-10 md:w-[70vw] lg:order-1 lg:w-[60vw] xl:w-[50vw]">
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
                <span className="mt-1 text-red-400">{errors[f.name]}</span>
              </InputGroup>
            ))}
            <Tabs variant="line" colorScheme="purple">
              <TabList>
                <Tab>Write</Tab>
                <Tab>Preview</Tab>
              </TabList>
              <TabPanels className="max-h-[60vh] min-h-[30vh] overflow-y-auto">
                <TabPanel>
                  <MarkdownEditor
                    value={inputs.content}
                    onChange={(value) =>
                      setInputs((prev) => ({ ...prev, content: value }))
                    }
                  />
                </TabPanel>
                <TabPanel>
                  <article className="prose max-w-[85vw] dark:prose-invert">
                    {inputs.content.trim() !== "" ? (
                      <RenderMarkdown content={inputs.content} />
                    ) : (
                      <div className="text-center font-medium text-slate-500">
                        Start typing to see the preview
                      </div>
                    )}
                  </article>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>
          <div className="order-1 flex h-fit flex-col gap-5 p-2 lg:sticky lg:top-24 lg:order-2">
            <h2 className="self-center text-xl">Options</h2>
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
              <span className="mt-1 text-red-400">{errors.newCategory}</span>
            </InputGroup>
            <Select
              value={inputs.categoryId}
              onChange={handleInputChange}
              name="categoryId"
              isDisabled={inputs.newCategory !== ""}
              placeholder="Choose a category"
              focusBorderColor="purple.400"
              borderColor="purple.200"
            >
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
              onClick={handleCreate}
            >
              {inputs.publish ? "Publish" : "Save"}
            </Button>
            <Button
              variant="outline"
              colorScheme="red"
              leftIcon={<MdDeleteForever />}
              onClick={onOpen}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

EditPost.withLayout = { showCommunityInfo: false };

export default EditPost;
