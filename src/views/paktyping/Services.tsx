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
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import Swal from 'sweetalert2';
import { api } from 'constants/api';

interface Service {
  id: number;
  name: string;
}

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [newService, setNewService] = useState<string>('');
  const [editingService, setEditingService] = useState<number | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const toast = useToast();

  // Fetch services on page load
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get<Service[]>('/service');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch services.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleAddService = async () => {
    try {
      if (newService != '') {
        const response = await api.post<Service>('/service', {
          name: newService,
        });
        setServices([...services, response.data]);
        setNewService('');
        toast({
          title: 'Success',
          description: 'Service added successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      } else {
        toast({
          title: 'Warning',
          description: 'Service cannot be empty.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      }
    } catch (error) {
      console.error('Error adding service:', error);
      toast({
        title: 'Error',
        description: 'Failed to add service.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const handleEditService = async (id: number) => {
    try {
      const response = await api.put<Service>(`/service/${id}`, {
        name: editingName,
      });
      setServices(
        services.map((service) =>
          service.id === id
            ? { ...service, name: response.data.name }
            : service,
        ),
      );
      setEditingService(null);
      setEditingName('');
      toast({
        title: 'Success',
        description: 'Service updated successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error editing service:', error);
      toast({
        title: 'Error',
        description: 'Failed to update service.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteService = async (id: number) => {
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
          await api.delete(`/service/${id}`);
          setServices(services.filter((service) => service.id !== id));
          Swal.fire('Deleted!', 'The service has been deleted.', 'success');
        } catch (error) {
          console.error('Error deleting service:', error);
          Swal.fire('Error!', 'Failed to delete the service.', 'error');
        }
      }
    });
  };

  return (
    <Card marginTop={'5%'}>
      <Box p={4}>
        <VStack align="start" spacing={4}>
          <FormControl id="newService">
            <FormLabel>Add New Service</FormLabel>
            <Input
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              placeholder="Enter service name"
            />
            <Button mt={2} colorScheme="blue" onClick={handleAddService}>
              Add Service
            </Button>
          </FormControl>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Service Name</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {services.map((service, index) => (
                <Tr key={service.id}>
                  <Td>{index + 1}</Td>
                  <Td>
                    {editingService === service.id ? (
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        placeholder="Edit service name"
                      />
                    ) : (
                      service.name
                    )}
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      {editingService === service.id ? (
                        <>
                          <Button
                            colorScheme="green"
                            size="sm"
                            onClick={() => handleEditService(service.id)}
                          >
                            Save
                          </Button>
                          <Button
                            colorScheme="gray"
                            size="sm"
                            onClick={() => setEditingService(null)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            colorScheme="yellow"
                            size="sm"
                            onClick={() => {
                              setEditingService(service.id);
                              setEditingName(service.name);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            colorScheme="red"
                            size="sm"
                            onClick={() => handleDeleteService(service.id)}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </VStack>
      </Box>
    </Card>
  );
};

export default Services;
