import {
	Drawer,
	DrawerCloseButton,
	DrawerContent,
	DrawerOverlay,
	useDisclosure,
} from "@chakra-ui/react";
import Navbar from "./navbar";
import SideBar from "./sidebar";

const Layout = ({ children, showCommunityInfo }) => {
	const { onClose, isOpen, onOpen } = useDisclosure();

	return (
		<div className="flex min-h-screen flex-col dark:bg-slate-900">
			<Navbar onSidebarOpen={onOpen} showCommunityInfo={showCommunityInfo} />
			<div className="flex grow">
				<aside>
					<Drawer isOpen={isOpen} placement="left" onClose={onClose}>
						<DrawerOverlay />
						<DrawerContent>
							<DrawerCloseButton />
							<SideBar
								onSidebarClose={onClose}
								showCommunityInfo={showCommunityInfo}
							/>
						</DrawerContent>
					</Drawer>
					{showCommunityInfo && (
						<div className="hidden h-full lg:block">
							<SideBar
								onSidebarClose={onClose}
								showCommunityInfo={showCommunityInfo}
							/>
						</div>
					)}
				</aside>
				<main className="flex grow flex-col overflow-y-auto">{children}</main>
			</div>
		</div>
	);
};

export default Layout;
