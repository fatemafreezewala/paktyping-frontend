/* eslint-disable */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  VStack,
  HStack,
  useToast,
  Text,
} from '@chakra-ui/react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { api } from '../../constants/api';
import Card from 'components/card/Card';
import useAuthStore from 'constants/useAuthStore';

const Tasks = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [clientSearch, setClientSearch] = useState('');
  const [clientResults, setClientResults] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [services, setServices] = useState([]);
  const { user } = useAuthStore();
  const [taskData, setTaskData] = useState({
    clientId: '',
    phone: '',
    serviceId: '',
    userId: '',
    status: '',
    desp: '',
    name: '',
  });
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
    fetchServices();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch tasks.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const fetchServices = async () => {
    try {
      const response = await api.get('/service');
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

  const handleSearchClients = async () => {
    try {
      const response = await api.get(`/clients?name=${clientSearch}`);
      setClientResults(response.data);
    } catch (error) {
      console.error('Error searching clients:', error);
      toast({
        title: 'Error',
        description: 'Failed to search clients.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSelectClient = (client: any) => {
    setSelectedClient(client);
    setTaskData({
      ...taskData,
      clientId: client.id,
      phone: client.phone,
      name: client.name,
    });
    setClientSearch(client.name);
    setClientResults([]);
  };

  const handleAddTask = async () => {
    taskData.userId = user.id;
    if (!taskData.clientId && (!taskData.phone || !selectedClient.name)) {
      Swal.fire('Error!', 'Please select or provide client details.', 'error');
      return;
    }
    if (
      !taskData.serviceId ||
      !taskData.status ||
      !taskData.userId ||
      !taskData.desp
    ) {
      Swal.fire('Error!', 'All fields are required.', 'error');
      return;
    }

    try {
      taskData.name = selectedClient.name;

      const response = await api.post('/tasks', taskData);

      Swal.fire('Success!', 'Task created successfully.', 'success');
      window.location.reload();
    } catch (error) {
      console.error('Error adding task:', error);
      Swal.fire('Error!', 'Failed to create task.', 'error');
    }
  };

  return (
    <Card marginTop={'5%'}>
      {' '}
      <Box p={4}>
        <VStack align="start" spacing={4}>
          <Text fontSize="2xl" fontWeight="bold">
            Add Task
          </Text>

          {/* Client Search */}
          <HStack spacing={4} w="100%">
            <FormControl>
              <FormLabel>Search Client</FormLabel>
              <Input
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                placeholder="Enter client name"
              />
            </FormControl>
            <Button colorScheme="blue" onClick={handleSearchClients}>
              Search
            </Button>
          </HStack>

          {/* Client Results */}
          {clientResults.length > 0 && (
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Phone</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {clientResults.map((client) => (
                  <Tr key={client.id}>
                    <Td>{client.name}</Td>
                    <Td>{client.phone}</Td>
                    <Td>
                      <Button
                        colorScheme="green"
                        size="sm"
                        onClick={() => handleSelectClient(client)}
                      >
                        Select
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}

          {/* Add Task Form */}
          <VStack spacing={4} w="100%">
            <HStack spacing={4} w="100%">
              <FormControl>
                <FormLabel>Task Status</FormLabel>
                <Select
                  value={taskData.status}
                  onChange={(e) =>
                    setTaskData({ ...taskData, status: e.target.value })
                  }
                >
                  <option value="">Select status</option>
                  <option value="0">Pending</option>
                  <option value="1">In Progress</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Task Description</FormLabel>
                <Input
                  value={taskData.desp}
                  onChange={(e) =>
                    setTaskData({ ...taskData, desp: e.target.value })
                  }
                  placeholder="Enter description"
                />
              </FormControl>
            </HStack>

            <HStack spacing={4} w="100%">
              <FormControl>
                <FormLabel>Service</FormLabel>
                <Select
                  value={taskData.serviceId}
                  onChange={(e) =>
                    setTaskData({ ...taskData, serviceId: e.target.value })
                  }
                >
                  <option value="">Select a service</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </HStack>

            <Button colorScheme="blue" onClick={handleAddTask}>
              Add Task
            </Button>
          </VStack>

          {/* Task List */}
          <Text fontSize="lg" fontWeight="bold" mt={8}>
            Task List
          </Text>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Client</Th>
                <Th>Phone</Th>
                <Th>Service</Th>
                <Th>Status</Th>
                <Th>Description</Th>
                <Th>Created At</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {tasks.map((task, index) => (
                <Tr key={task.id}>
                  <Td>{index + 1}</Td>
                  <Td>{task.client.name}</Td>
                  <Td>{task.client.phone}</Td>
                  <Td>{task.service.name}</Td>
                  <Td>
                    {task.status === '0' && (
                      <Badge colorScheme="gray">Pending</Badge>
                    )}
                    {task.status === '1' && (
                      <Badge colorScheme="blue">In Progress</Badge>
                    )}
                    {task.status === '2' && (
                      <Badge colorScheme="green">Completed</Badge>
                    )}
                    {task.status === '3' && (
                      <Badge colorScheme="yellow">Paused</Badge>
                    )}
                    {task.status === '4' && (
                      <Badge colorScheme="red">Rejected</Badge>
                    )}
                  </Td>
                  <Td>{task.desp}</Td>
                  <Td>{new Date(task.createdAt).toLocaleString()}</Td>
                  <Td>
                    <Button
                      colorScheme="yellow"
                      size="sm"
                      onClick={() => navigate(`/admin/task-detail/${task.id}`)}
                    >
                      View
                    </Button>
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

export default Tasks;
