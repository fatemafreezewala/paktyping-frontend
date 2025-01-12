/* eslint-disable */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
  HStack,
  useToast,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import Swal from 'sweetalert2';
import { api } from 'constants/api';
import Card from 'components/card/Card';

interface Client {
  id: number;
  name: string;
  phone: string;
}

const Client: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [newClient, setNewClient] = useState<{ name: string; phone: string }>({
    name: '',
    phone: '',
  });
  const [editingClient, setEditingClient] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<{
    name: string;
    phone: string;
  }>({ name: '', phone: '' });
  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await api.get<Client[]>('/clients/all');
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch clients.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleAddClient = async () => {
    if (!newClient.name || !newClient.phone) {
      Swal.fire('Error!', 'Both name and phone are required.', 'error');
      return;
    }

    try {
      const response = await api.post<Client>('/clients', newClient);
      setClients([...clients, response.data]);
      setNewClient({ name: '', phone: '' });
      onAddClose();
      Swal.fire('Success!', 'Client added successfully.', 'success');
    } catch (error) {
      console.error('Error adding client:', error);
      Swal.fire('Error!', 'Failed to add client.', 'error');
    }
  };

  const handleEditClient = async (id: number) => {
    if (!editingData.name || !editingData.phone) {
      Swal.fire('Error!', 'Both name and phone are required.', 'error');
      return;
    }

    try {
      const response = await api.put<Client>(`/clients/${id}`, editingData);
      setClients(
        clients.map((client) =>
          client.id === id ? { ...client, ...response.data } : client,
        ),
      );
      setEditingClient(null);
      setEditingData({ name: '', phone: '' });
      onEditClose();
      Swal.fire('Success!', 'Client updated successfully.', 'success');
    } catch (error) {
      console.error('Error editing client:', error);
      Swal.fire('Error!', 'Failed to update client.', 'error');
    }
  };

  const handleDeleteClient = async (id: number) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/clients/${id}`);
          setClients(clients.filter((client) => client.id !== id));
          Swal.fire('Deleted!', 'The client has been deleted.', 'success');
        } catch (error) {
          console.error('Error deleting client:', error);
          Swal.fire('Error!', 'Failed to delete client.', 'error');
        }
      }
    });
  };

  return (
    <Card marginTop={'5%'}>
      <Box p={4}>
        <VStack align="start" spacing={4}>
          <Button colorScheme="blue" onClick={onAddOpen}>
            Add Client
          </Button>
          <Divider></Divider>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Name</Th>
                <Th>Phone</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {clients.map((client, index) => (
                <Tr key={client.id}>
                  <Td>{index + 1}</Td>
                  <Td>{client.name}</Td>
                  <Td>{client.phone}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <Button
                        colorScheme="yellow"
                        size="sm"
                        onClick={() => {
                          setEditingClient(client.id);
                          setEditingData({
                            name: client.name,
                            phone: client.phone,
                          });
                          onEditOpen();
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        colorScheme="red"
                        size="sm"
                        onClick={() => handleDeleteClient(client.id)}
                      >
                        Delete
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </VStack>
      </Box>

      {/* Add Client Modal */}
      <Modal isOpen={isAddOpen} onClose={onAddClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Client</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="clientName">
              <FormLabel>Client Name</FormLabel>
              <Input
                value={newClient.name}
                onChange={(e) =>
                  setNewClient({ ...newClient, name: e.target.value })
                }
                placeholder="Enter client name"
              />
            </FormControl>
            <FormControl id="clientPhone" mt={4}>
              <FormLabel>Phone Number</FormLabel>
              <Input
                value={newClient.phone}
                onChange={(e) =>
                  setNewClient({ ...newClient, phone: e.target.value })
                }
                placeholder="Enter phone number"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddClient}>
              Add
            </Button>
            <Button variant="ghost" onClick={onAddClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Client Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Client</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="clientName">
              <FormLabel>Client Name</FormLabel>
              <Input
                value={editingData.name}
                onChange={(e) =>
                  setEditingData({ ...editingData, name: e.target.value })
                }
                placeholder="Edit client name"
              />
            </FormControl>
            <FormControl id="clientPhone" mt={4}>
              <FormLabel>Phone Number</FormLabel>
              <Input
                value={editingData.phone}
                onChange={(e) =>
                  setEditingData({ ...editingData, phone: e.target.value })
                }
                placeholder="Edit phone number"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => handleEditClient(editingClient!)}
            >
              Save
            </Button>
            <Button variant="ghost" onClick={onEditClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
};

export default Client;
