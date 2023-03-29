import Image from "next/image";
import Link from "next/link";

export default function Custom404() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-5">
			<Image
				src="https://illustrations.popsy.co/violet/falling.svg"
				alt="404"
				width={300}
				height={300}
			/>
			<h1 className="mx-10 text-center text-xl font-semibold text-slate-700 md:text-2xl">
				The page you&apos;re looking for can&apos;t be found.
			</h1>
			<Link href="/">
				<button
					type="button"
					className="flex items-center gap-2 rounded-md border-2 border-purple-300 px-2 py-1 text-lg md:px-3 md:py-2"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="h-6 w-6"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
						/>
					</svg>
					<span className="font-medium text-slate-500">Back to home</span>
				</button>
			</Link>
		</div>
	);
}
