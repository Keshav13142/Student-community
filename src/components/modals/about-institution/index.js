import {
	fetchInstitutionData,
	resetInstInviteCodes,
} from "@/lib/api-calls/institution";
import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Avatar,
	Button,
	IconButton,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRef, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { HiDotsVertical } from "react-icons/hi";
import { MdOutlineLockReset } from "react-icons/md";
import InstitutionAdminActions from "../admin-actions/institution";
import EditInstitutionInfo from "./EditInstitutionInfo";
import InstitutionInfo from "./InstitutionInfo";
import Members from "./InstitutionMembers";
import InstitutionRequests from "./InstitutionRequests";

const InstitutionMenu = ({ onEditOpen, isCurrentUserAdmin, institutionId }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = useRef(null);
	const toast = useToast();
	const queryClient = useQueryClient();

	const resetCodesMutation = useMutation(resetInstInviteCodes, {
		onError: ({ response: { data: { error, message } } }) => {
			toast({
				title: error,
				description: message,
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["institutionInviteCodes"] });
			toast({
				title: "Sucessfully reset invite codes",
				status: "success",
				duration: 2000,
				isClosable: true,
			});
		},
		onSettled: onClose,
	});

	return (
		<>
			<AlertDialog
				isOpen={isOpen}
				motionPreset="slideInRight"
				leastDestructiveRef={cancelRef}
				onClose={onClose}
			>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize="lg" fontWeight="bold">
							Reset the invite codes
						</AlertDialogHeader>
						<AlertDialogBody>
							Performing this action will invalidate all previous invite codes
							and cannot be reverted
						</AlertDialogBody>
						<AlertDialogFooter>
							<Button ref={cancelRef} onClick={onClose}>
								Cancel
							</Button>
							<Button
								colorScheme="red"
								isLoading={resetCodesMutation.isLoading}
								onClick={() => {
									resetCodesMutation.mutate(institutionId);
								}}
								ml={3}
							>
								Reset
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
			<Menu>
				<MenuButton
					size="sm"
					as={IconButton}
					icon={<HiDotsVertical />}
					bg="transparent"
				>
					Actions
				</MenuButton>
				<MenuList className="text-base font-normal">
					{isCurrentUserAdmin && (
						<>
							<MenuItem
								color="blue.500"
								icon={<BiEdit size={20} />}
								onClick={onEditOpen}
							>
								Edit info
							</MenuItem>
							<MenuItem
								color="red.300"
								icon={<MdOutlineLockReset size={20} />}
								onClick={onOpen}
							>
								Reset invite codes
							</MenuItem>
						</>
					)}
				</MenuList>
			</Menu>
		</>
	);
};

const AboutInstitution = ({ isOpen, onClose, onSidebarClose }) => {
	const { data: institutionData } = useQuery(
		["aboutInstitution"],
		fetchInstitutionData,
	);

	const session = useSession();
	const isCurrentUserAdmin = session.data?.user.isInstitutionAdmin;

	const {
		isOpen: isActionsOpen,
		onClose: onActionsClose,
		onOpen: onActionsOpen,
	} = useDisclosure();

	const [tabIndex, setTabIndex] = useState(0);
	const handleTabsChange = (index) => {
		if (index !== 0) setIsEditMode(false);
		setTabIndex(index);
	};

	const [action, setAction] = useState({
		type: "",
		userId: "",
	});

	const [isEditMode, setIsEditMode] = useState(false);

	return (
		<>
			{isCurrentUserAdmin && (
				<InstitutionAdminActions
					institutionId={institutionData?.id}
					action={action}
					onClose={onActionsClose}
					isOpen={isActionsOpen}
				/>
			)}
			<Modal
				blockScrollOnMount={false}
				isOpen={isOpen}
				onClose={onClose}
				scrollBehavior="inside"
				size={["xs", "sm", "md", "xl"]}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader className="flex items-center justify-center gap-2">
						<div className="flex items-center gap-2">
							<Avatar
								src={institutionData?.image}
								name={institutionData?.name}
								size="sm"
							/>
							<h1 className="text-xl text-purple-500 dark:text-slate-300 md:text-2xl">
								{institutionData?.name}
							</h1>
						</div>
						<InstitutionMenu
							isCurrentUserAdmin={isCurrentUserAdmin}
							institutionId={institutionData?.id}
							onEditOpen={() => {
								setTabIndex(0);
								setIsEditMode((prev) => !prev);
							}}
						/>
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Tabs
							isFitted
							variant="line"
							colorScheme="purple"
							index={tabIndex}
							onChange={handleTabsChange}
						>
							<TabList mb="1em">
								<Tab>Info</Tab>
								<Tab>Members</Tab>
								{isCurrentUserAdmin && <Tab>Requests</Tab>}
							</TabList>
							<TabPanels>
								<TabPanel>
									{isEditMode ? (
										<EditInstitutionInfo
											data={institutionData}
											onCancel={() => setIsEditMode(false)}
										/>
									) : (
										<InstitutionInfo data={institutionData} />
									)}
								</TabPanel>
								<TabPanel>
									<Members
										onClose={() => {
											onClose();
											onSidebarClose();
										}}
										doAction={(data) => {
											setAction(data);
											onActionsOpen();
										}}
										members={institutionData?.members}
									/>
								</TabPanel>
								{isCurrentUserAdmin && (
									<TabPanel>
										<InstitutionRequests institutionId={institutionData?.id} />
									</TabPanel>
								)}
							</TabPanels>
						</Tabs>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default AboutInstitution;
