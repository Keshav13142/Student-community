import prisma from "@/lib/prisma";
import Navbar from "@/src/components/Layout/navbar";
import { synthWave } from "@/src/theme";
import { createNewPost, getAllCategories } from "@/src/utils/api-calls/posts";
import { createPostSchema, parseZodErrors } from "@/src/utils/zod_schemas";
import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Spinner,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
} from "@chakra-ui/react";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { useMutation, useQuery } from "@tanstack/react-query";
import CodeMirror from "@uiw/react-codemirror";
import { getServerSession } from "next-auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { BsFillImageFill } from "react-icons/bs";
import { HiOutlineUpload } from "react-icons/hi";
import { IoSaveSharp } from "react-icons/io5";
import { MdOutlineCategory, MdTitle } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";
import { authOptions } from "../api/auth/[...nextauth]";

export async function getServerSideProps({ req, res }) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const allCategories = await prisma.category.findMany({});

  return {
    props: {
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

const CreateNewPost = ({ allCategories }) => {
  const toast = useToast();
  const router = useRouter();

  const [inputs, setInputs] = useState({
    title: "",
    bannerImage: "",
    content: "",
    categoryId: null,
    newCategory: "",
    publish: false,
  });

  const [errors, setErrors] = useState({
    title: null,
    bannerImage: null,
    content: null,
    categoryId: null,
    newCategory: null,
    publish: null,
  });

  const mutation = useMutation(createNewPost, {
    onError: (error) => {
      console.log(error);
      toast({
        title: "Unable to create post",
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

    mutation.mutate(inputs);
  };

  return (
    <>
      <Head>
        <title>Create a new Post</title>
        <meta
          name="description"
          content="Platform for students within institutions to interact"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="min-h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center gap-20 py-10 lg:flex-row lg:items-start">
          <div className="order-2 flex min-w-[55%] max-w-3xl flex-col gap-10 lg:order-1 lg:max-w-[60%]">
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
                    onChange={(value) => {
                      setInputs((prev) => ({ ...prev, content: value }));
                    }}
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
                              {...props}
                            >
                              {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {inputs.content}
                    </ReactMarkdown>
                  </article>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>
          <div className="order-1 flex h-fit flex-col gap-5 p-2 lg:sticky lg:top-24 lg:order-2">
            <h2 className="self-center text-xl">Post options</h2>
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
              isLoading={mutation.isLoading}
              leftIcon={inputs.publish ? <HiOutlineUpload /> : <IoSaveSharp />}
              onClick={handleCreate}
            >
              {inputs.publish ? "Publish" : "Save as draft"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateNewPost;
