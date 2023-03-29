import { communityActions, getCommInviteCode } from "@/lib/api-calls/community";
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
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { AiOutlineClear } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { HiDotsVertical } from "react-icons/hi";
import { IoExitOutline } from "react-icons/io5";
import { MdOutlineDelete, MdOutlineLockReset } from "react-icons/md";
import CommunityActions from "../admin-actions/community";
import CommunityInfo from "./CommunityInfo";
import { default as CommunityMembers } from "./CommunityMembers";
import CommunityRequests from "./CommunityRequests";
import EditCommunityInfo from "./EditCommunityInfo";

const CommunityMenu = ({ communityId, isCurrentUserAdmin, onEditOpen }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [alertAction, setAlertAction] = useState();
	const cancelRef = useRef(null);
	const toast = useToast();
	const queryClient = useQueryClient();
	const router = useRouter();

	const showAlert = (type) => {
		setAlertAction(type);
		onOpen();
	};

	const clearChatMutation = useMutation(communityActions, {
		onError: ({ response: { data: { error, message } } }) => {
			toast({
				title: error,
				description: message,
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		},
		onSuccess: ({ message }) => {
			queryClient.invalidateQueries({ queryKey: ["userCommunities"] });
			queryClient.invalidateQueries({ queryKey: ["messages", communityId] });
			toast({
				title: message,
				status: "success",
				duration: 2000,
				isClosable: true,
			});
		},
		onSettled: onClose,
	});

	const deleteCommMutation = useMutation(communityActions, {
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
			queryClient.invalidateQueries({ queryKey: ["userCommunities"] });
			queryClient.removeQueries({ queryKey: ["messages", communityId] });
			queryClient.removeQueries({ queryKey: ["communityInfo", communityId] });
			queryClient.removeQueries({
				queryKey: ["communityInviteCode", communityId],
			});
			router.push("/discover");
			toast({
				title: "Deleted Community sucessfully",
				description: "It may take some time for messages to be delted",
				status: "success",
				duration: 2000,
				isClosable: true,
			});
		},
		onSettled: onClose,
	});

	const leaveCommMutation = useMutation(communityActions, {
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
			queryClient.invalidateQueries({ queryKey: ["userCommunities"] });
			queryClient.invalidateQueries({ queryKey: ["publicCommunities"] });
			queryClient.removeQueries({ queryKey: ["messages", communityId] });
			queryClient.removeQueries({ queryKey: ["communityInfo", communityId] });
			queryClient.removeQueries({
				queryKey: ["communityInviteCode", communityId],
			});
			router.push("/discover");
		},
		onSettled: onClose,
	});

	const resetCodesMutation = useMutation(communityActions, {
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
			queryClient.invalidateQueries({ queryKey: ["communityInviteCode"] });
			toast({
				title: "Sucessfully reset invite codes",
				status: "success",
				duration: 2000,
				isClosable: true,
			});
		},
		onSettled: onClose,
	});

	const alertTypes = {
		"clear-chat": {
			title: "Clear all messages",
			desc: "Are you sure? You can't undo this action afterwards.",
			action: "Clear",
			mutation: clearChatMutation,
		},
		"delete-community": {
			title: "Delete community",
			desc: "Are you sure? You can't undo this action afterwards.",
			action: "Delete",
			mutation: deleteCommMutation,
		},
		"leave-community": {
			title: "Leave community",
			desc: "Are you sure? You can't undo this action afterwards.\nMessages you sent won't be deleted.",
			action: "Leave",
			mutation: leaveCommMutation,
		},
		"reset-code": {
			title: "Reset invite code",
			desc: "Performing this action will invalidate all previous invite codes and cannot be reverted.",
			action: "Reset",
			mutation: resetCodesMutation,
		},
	};

	const handleAlertClick = () => {
		const alert = alertTypes[alertAction];
		alert.mutation.mutate({ communityId, action: alertAction });
	};

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
							{alertTypes[alertAction]?.title}
						</AlertDialogHeader>
						<AlertDialogBody>{alertTypes[alertAction]?.desc}</AlertDialogBody>
						<AlertDialogFooter>
							<Button ref={cancelRef} onClick={onClose}>
								Cancel
							</Button>
							<Button
								colorScheme="red"
								isLoading={alertTypes[alertAction]?.mutation.isLoading}
								onClick={handleAlertClick}
								ml={3}
							>
								{alertTypes[alertAction]?.action}
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
								onClick={() => {
									showAlert("reset-code");
								}}
							>
								Reset invite codes
							</MenuItem>
							<MenuItem
								color="red.300"
								icon={<AiOutlineClear size={20} />}
								onClick={() => {
									showAlert("clear-chat");
								}}
							>
								Clear chat
							</MenuItem>
							<MenuItem
								color="red.300"
								icon={<MdOutlineDelete size={20} />}
								onClick={() => {
									showAlert("delete-community");
								}}
							>
								Delete community
							</MenuItem>
						</>
					)}
					<MenuItem
						icon={<IoExitOutline size={20} />}
						onClick={() => {
							showAlert("leave-community");
						}}
					>
						Leave community
					</MenuItem>
				</MenuList>
			</Menu>
		</>
	);
};

const AboutCommunity = ({ isOpen, onClose, data }) => {
	const { data: codeData } = useQuery(
		["communityInviteCode", data?.id],
		() => getCommInviteCode(data.id),
		{ enabled: Boolean(data.isCurrentUserAdmin) },
	);

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
			{data?.isCurrentUserAdmin && (
				<CommunityActions
					communityId={data?.id}
					action={action}
					onClose={onActionsClose}
					isOpen={isActionsOpen}
				/>
			)}
			<Modal
				blockScrollOnMount={false}
				isOpen={isOpen}
				onClose={onClose}
				size={["xs", "sm", "md", "xl"]}
				scrollBehavior="inside"
			>
				<ModalOverlay />
				<ModalContent className="min-w-[30%]">
					<ModalHeader className="mt-5 flex items-center justify-center gap-2">
						<div className="flex items-center gap-2">
							<Avatar src={data?.image} name={data?.name} size="sm" />
							<h1 className="text-xl text-purple-500 dark:text-slate-300 md:text-2xl">
								{data?.name}
							</h1>
						</div>
						{data.isCurrentUserMember && (
							<CommunityMenu
								communityId={data.id}
								isCurrentUserAdmin={data.isCurrentUserAdmin}
								onEditOpen={() => {
									setTabIndex(0);
									setIsEditMode((prev) => !prev);
								}}
							/>
						)}
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
								{data.isCurrentUserAdmin && data.type === "RESTRICTED" && (
									<Tab>Requests</Tab>
								)}
							</TabList>
							<TabPanels>
								<TabPanel>
									{isEditMode ? (
										<EditCommunityInfo
											data={data}
											onCancel={() => {
												setIsEditMode(false);
											}}
										/>
									) : (
										<CommunityInfo data={data} code={codeData?.[0]?.code} />
									)}
								</TabPanel>
								<TabPanel>
									<CommunityMembers
										onClose={onClose}
										doAction={(data) => {
											setAction(data);
											onActionsOpen();
										}}
										data={data}
									/>
								</TabPanel>
								{data.isCurrentUserAdmin && data.type === "RESTRICTED" && (
									<TabPanel>
										<CommunityRequests communityId={data.id} />
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

export default AboutCommunity;
