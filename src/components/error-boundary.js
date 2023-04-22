import Head from "next/head";
import Image from "next/image";
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <Head>
            <title>Student community</title>
            <meta
              name="description"
              content="Platform for students within institutions to interact"
            />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/favicon.png" />
          </Head>
          <div className="flex min-h-screen flex-col items-center justify-center gap-5">
            <Image
              src="https://illustrations.popsy.co/violet/timed-out-error.svg"
              alt=""
              width={300}
              height={300}
            />
            <h1 className="text-xl font-semibold text-slate-700 md:text-2xl">
              Oops, something went wrong!
            </h1>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false })}
              className="flex items-center gap-2 rounded-md border-2 border-purple-300 px-2 py-1 text-lg md:px-3 md:py-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
              <span className="font-medium text-slate-500">Refresh</span>
            </button>
          </div>
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
