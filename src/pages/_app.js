import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Analytics } from "@vercel/analytics/react";
import { SessionProvider } from "next-auth/react";
import AuthGuard from "../components/Auth";
import DefaultHead from "../components/default-seo";
import ErrorBoundary from "../components/error-boundary";
import Layout from "../components/Layout";
import { TailwindIndicator } from "../components/tailwindcss-indicator";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
	return (
		<ErrorBoundary>
			<QueryClientProvider client={queryClient}>
				<ChakraProvider>
					<SessionProvider
						session={pageProps.session}
						refetchOnWindowFocus={false}
					>
						<DefaultHead />
						<main>
							{Component.withLayout ? (
								<Layout
									showCommunityInfo={Component.withLayout.showCommunityInfo}
								>
									{Component.withAuth ? (
										<AuthGuard>
											<Component {...pageProps} />
										</AuthGuard>
									) : (
										<Component {...pageProps} />
									)}
								</Layout>
							) : Component.withAuth ? (
								<AuthGuard>
									<Component {...pageProps} />
								</AuthGuard>
							) : (
								<Component {...pageProps} />
							)}
						</main>
						<ReactQueryDevtools />
						<Analytics />
						<TailwindIndicator />
					</SessionProvider>
				</ChakraProvider>
			</QueryClientProvider>
		</ErrorBoundary>
	);
}
