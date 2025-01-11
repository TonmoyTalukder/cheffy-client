"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Button,
  Input,
  Slider,
  Chip,
  Image,
  Switch,
} from "@nextui-org/react";
import Link from "next/link";

import { useGetAllUsers, useUpdateUserDynamicID } from "@/src/hooks/user.hooks";
import { IUser } from "@/src/types";
import CreateAdminModal from "@/src/components/modal/CreateAdmin";
import { useUserRegistration } from "@/src/hooks/auth.hooks";

const AdminUser = () => {
  const { data: usersFetchedData, isLoading, error } = useGetAllUsers();
  const { mutate: handleUpdateUserApi } = useUpdateUserDynamicID();
  const {
    mutate: handleUserSignUp,
    isPending,
    isSuccess,
  } = useUserRegistration();

  const [searchTerm, setSearchTerm] = useState("");
  const [reportFilter, setReportFilter] = useState<[number, number]>([1, 100]);
  const [showReportedOnly, setShowReportedOnly] = useState(false); // Switch state
  const [isModalOpen, setModalOpen] = useState(false);

  const usersData = usersFetchedData?.data;

  // Sort the users by creation date (newest first)
  const sortedUsers =
    usersData
      ?.slice()
      .sort(
        (a: IUser, b: IUser) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ) || [];

  // Filter users by report number, search term, and switch state
  const filteredUsers = useMemo(() => {
    return sortedUsers.filter((user: IUser) => {
      const matchesSearchTerm =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      if (showReportedOnly) {
        // Show only reported users and apply report filter
        const withinReportRange =
          Number(user.report) >= reportFilter[0] &&
          Number(user.report) <= reportFilter[1];

        return withinReportRange && matchesSearchTerm;
      }

      // Show all users if switch is off
      return matchesSearchTerm;
    });
  }, [sortedUsers, reportFilter, searchTerm, showReportedOnly]);

  const handleBlockUser = (userId: string, userData: IUser) => {
    const updatedData = {
      ...userData,
      status: "BLOCKED",
    };

    handleUpdateUserApi({ id: userId, userData: updatedData });
  };

  const handleUnblockUser = (userId: string, userData: IUser) => {
    const updatedData = {
      ...userData,
      status: "ACTIVE",
    };

    handleUpdateUserApi({ id: userId, userData: updatedData });
  };

  // Function to handle modal open
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  // Function to handle modal close
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Function to handle new admin creation
  const handleCreateAdmin = (newAdmin: IUser) => {
    console.log("New Admin => ", newAdmin);
    // handleUserSignUp(newAdmin);
  };

  const handleUpdateRole = (userId: string, userData: IUser) => {
    const isAdmin = userData.role === "ADMIN" && true;
    const updatedData = {
      ...userData,
      role: isAdmin ? "USER" : "ADMIN",
    };

    handleUpdateUserApi({ id: userId, userData: updatedData });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center">
        <Spinner color="white" size="lg" className="my-8" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-col items-center w-full px-4 py-6">
      <h1 className="text-xl font-bold mb-4">
        Total users: {filteredUsers.length}
      </h1>

      {/* Search, Report Filter, and Switch */}
      <div className="flex flex-col items-center w-full gap-4 mb-6">
        <Input
          label="Search Users"
          placeholder="Search by name or email"
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2"
        />

        <div className="flex justify-between items-center w-full max-w-md">
          <p className="text-md font-medium">Show Only Reported Users</p>
          <Switch
            checked={showReportedOnly}
            onChange={() => setShowReportedOnly(!showReportedOnly)}
          />
        </div>

        {/* Show Report Filter Slider only when "Show Only Reported Users" is active */}
        {showReportedOnly && (
          <Slider
            label="Report Filter"
            step={1}
            minValue={1}
            maxValue={100}
            defaultValue={[1, 100]}
            value={reportFilter}
            onChange={(value) => setReportFilter(value as [number, number])}
            className="max-w-md"
          />
        )}
      </div>

      {/* Create Admin Button */}
      <Button
        color="primary"
        size="sm"
        className="mb-4"
        onClick={handleOpenModal}
      >
        Create User
      </Button>

      {/* Create Admin Modal */}
      <CreateAdminModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCreate={handleCreateAdmin}
      />

      {/* User Table */}
      <Table
        aria-label="Admin User Table"
        shadow="md"
        className="w-full max-w-5xl overflow-auto p-1 rounded-xl"
      >
        <TableHeader>
          <TableColumn>Picture</TableColumn>
          <TableColumn>Name</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Report Number</TableColumn>
          <TableColumn>Role</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user: IUser) => (
            <TableRow key={user._id}>
              {/* Display Picture */}
              <TableCell>
                <Image
                  src={user.displayPicture}
                  alt={user.name}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
              </TableCell>
              <TableCell>
                <Link
                  href={`${window.location.origin}/profile/${user._id}`}
                  color="foreground"
                  className="flex justify-between w-full hover:underline"
                >
                  {user.name}
                </Link>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.report}</TableCell>
              <TableCell>
                <Chip
                  className="capitalize"
                  color={user.role === "ADMIN" ? "primary" : "warning"}
                  size="sm"
                  variant="flat"
                >
                  {user.role}
                </Chip>
              </TableCell>
              <TableCell>
                <Chip
                  className="capitalize"
                  color={user.status === "ACTIVE" ? "success" : "danger"}
                  size="sm"
                  variant="flat"
                >
                  {user.status}
                </Chip>
              </TableCell>
              <TableCell>
                <Button
                  color="secondary"
                  size="sm"
                  className="mr-2"
                  onClick={() => handleUpdateRole(user._id!, user)}
                >
                  Change Role
                </Button>

                {user.status === "ACTIVE" ? (
                  <Button
                    color="danger"
                    size="sm"
                    onClick={() => handleBlockUser(user._id!, user)}
                  >
                    Block
                  </Button>
                ) : (
                  <Button
                    color="default"
                    size="sm"
                    onClick={() => handleUnblockUser(user._id!, user)}
                  >
                    Unblock
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminUser;
