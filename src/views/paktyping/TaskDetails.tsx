/* eslint-disable */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Spinner,
  VStack,
  HStack,
  useToast,
  Text,
  List,
  ListItem,
  Link,
  Badge,
  SimpleGrid,
  Divider,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Stack,
  StackDivider,
  Flex,
} from '@chakra-ui/react';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import { api } from '../../constants/api';
import CardMain from 'components/card/Card';

interface Client {
  name: string;
  phone: string;
}

interface Service {
  name: string;
}

interface Note {
  id: number;
  note: string;
  createdAt: string;
  user?: { name: string };
  attachment?: string;
}

interface Attachment {
  fileName: string;
  title?: string;
}

interface SubTask {
  id: string; // Unique identifier for the subtask
  taskId: string; // ID of the parent task
  desp: string; // Description of the subtask
  status: string; // Status of the subtask (e.g., Pending, In Progress)
  createdAt: string; // ISO date string representing the creation time
  notes: Note[]; // Array of notes related to the subtask
}

interface Task {
  id: number;
  client: Client;
  service: Service;
  status: string;
  desp: string;
  notes: Note[];
  attachments: Attachment[];
  user: { id: number; name: string };
  subtasks: SubTask[];
}

const TaskDetail: React.FC = () => {
  const { id } = useParams();
  const toast = useToast();
  const [task, setTask] = useState<Task | null>(null);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});
  const [file, setFile] = useState<File | null>(null);
  const [taskfile, setTaskFile] = useState<File | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [fileTitle, setFileTitle] = useState('');
  const [selectedSubTaskId, setSelectedSubTaskId] = useState('');
  const [subtaskdata, setSubTaskData] = useState({
    taskId: '',
    desp: '',
    status: '',
  });
  const [notesVisibility, setNotesVisibility] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleNotesVisibility = (subtaskId: string) => {
    setSelectedSubTaskId(subtaskId);
    setNotesVisibility((prev) => ({
      ...prev,
      [subtaskId]: !prev[subtaskId],
    }));
  };

  useEffect(() => {
    fetchTaskDetails();
  }, [id]);

  const fetchTaskDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/tasks/${id}`);
      setTask(response.data);
      setEditedTask(response.data);
      setAttachments(response.data.attachments);
    } catch (error) {
      console.error('Error fetching task details:', error);
      Swal.fire('Error!', 'Failed to load task details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (attachment: string = '') => {
    if (!newNote.trim()) {
      Swal.fire('Error!', 'Note cannot be empty.', 'error');
      return;
    }
    try {
      await api.post(`/tasks/notes`, {
        note: newNote,
        userId: task?.user.id,
        subTaskId: selectedSubTaskId,
        attachment,
      });
      fetchTaskDetails();
      setSelectedSubTaskId('');
      setNewNote('');
      Swal.fire('Success!', 'Note added successfully.', 'success');
    } catch (error) {
      console.error('Error adding note:', error);
      Swal.fire('Error!', 'Failed to add note.', 'error');
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleUpdateTask = async () => {
    try {
      await api.put(`/tasks/${task?.id}`, editedTask);
      fetchTaskDetails();
      setIsEditing(false);
      Swal.fire('Success!', 'Task updated successfully.', 'success');
    } catch (error) {
      console.error('Error updating task:', error);
      Swal.fire('Error!', 'Failed to update task.', 'error');
    }
  };

  const uploadFile = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await api.post('/uploadFile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        handleAddNote(response.data.data);
      } catch (error) {
        console.error('Error uploading file:', error);
        Swal.fire('Error!', 'Failed to upload file.', 'error');
      }
    } else {
      handleAddNote('');
    }
  };

  const handleAddFileToTask = async () => {
    if (taskfile) {
      const formData = new FormData();
      formData.append('file', taskfile);
      try {
        const response = await api.post('/uploadFile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const filename = response.data.data;
        await api.post('/tasks/attachment', {
          taskId: id,
          fileName: filename,
          title: fileTitle,
        });
        fetchTaskDetails();
      } catch (error) {
        console.error('Error adding file to task:', error);
      }
    }
  };

  if (loading || !task) {
    return (
      <Box textAlign="center" py={6}>
        <Spinner size="xl" />
        <Text>Loading task details...</Text>
      </Box>
    );
  }
  const addSubtask = async () => {
    if (!subtaskdata.desp.trim() || !subtaskdata.status) {
      Swal.fire('Error!', 'Description and status are required.', 'error');
      return;
    }

    try {
      await api.post('/tasks/subtask', {
        taskId: id, // Pass the current task ID
        desp: subtaskdata.desp,
        status: subtaskdata.status,
      });

      Swal.fire('Success!', 'Subtask added successfully.', 'success');
      window.location.reload();
    } catch (error) {
      console.error('Error adding subtask:', error);
      Swal.fire('Error!', 'Failed to add subtask.', 'error');
    }
  };

  const handleSubtaskInput = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setSubTaskData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <CardMain marginTop={'5%'}>
      <Box p={3}>
        <VStack align="start" spacing={6}>
          <div
            style={{
              backgroundColor: '#eaf8ff96',
              padding: '3%',
              borderRadius: 10,
            }}
          >
            <h1 style={{ fontSize: 20, fontWeight: 'bold' }}>Edit Task</h1>
            <SimpleGrid columns={3} spacing={4} w="100%">
              <FormControl>
                <FormLabel>Client Name</FormLabel>
                <Input value={editedTask.client?.name || ''} isReadOnly />
              </FormControl>
              <FormControl>
                <FormLabel>Phone Number</FormLabel>
                <Input value={editedTask.client?.phone || ''} isReadOnly />
              </FormControl>
              <FormControl>
                <FormLabel>Service</FormLabel>
                <Input value={editedTask.service?.name || ''} isReadOnly />
              </FormControl>
            </SimpleGrid>
            <SimpleGrid columns={3} spacing={4} w="100%">
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select
                  value={editedTask.status}
                  onChange={(e) =>
                    setEditedTask({ ...editedTask, status: e.target.value })
                  }
                >
                  <option value="0">Pending</option>
                  <option value="1">In Progress</option>
                  <option value="2">Completed</option>
                  <option value="3">Paused</option>
                  <option value="4">Rejected</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={editedTask.desp || ''}
                  onChange={(e) =>
                    setEditedTask({ ...editedTask, desp: e.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <Button mt={8} colorScheme="blue" onClick={handleUpdateTask}>
                  Save Changes
                </Button>
              </FormControl>
            </SimpleGrid>
            <Divider marginTop={'5%'}></Divider>
            <VStack align="start" w="100%">
              <h1 style={{ fontSize: 20, fontWeight: 'bold' }}>Add File</h1>
              <SimpleGrid columns={3} spacing={4} w="100%">
                <FormControl>
                  <FormLabel>File</FormLabel>
                  <Input
                    type="file"
                    onChange={(e) => setTaskFile(e.target.files?.[0] || null)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Title</FormLabel>
                  <Input
                    value={fileTitle}
                    onChange={(e) => setFileTitle(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  {' '}
                  <Button colorScheme="blue" onClick={handleAddFileToTask}>
                    Add File
                  </Button>
                </FormControl>
              </SimpleGrid>

              <List spacing={3} mt={4}>
                {attachments.map((a, i) => (
                  <ListItem key={i}>
                    <Link
                      href={`https://blueteam.b-cdn.net/paktyping/${a.fileName}`}
                      isExternal
                    >
                      {a.title || `File ${i + 1}`}
                    </Link>
                  </ListItem>
                ))}
              </List>
            </VStack>
          </div>
          <div
            style={{
              backgroundColor: '#fff8eae6',
              padding: '3%',
              borderRadius: 10,
              width: '100%',
            }}
          >
            <VStack align="start" spacing={4} w="100%">
              <h1 style={{ fontSize: 20, fontWeight: 'bold' }}>Add SubTask</h1>
              <HStack spacing={4} w="100%">
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    name="desp"
                    value={subtaskdata.desp}
                    onChange={handleSubtaskInput}
                    placeholder="Enter description"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Select
                    name="status"
                    value={subtaskdata.status}
                    onChange={handleSubtaskInput}
                  >
                    <option value="">Select Status</option>
                    <option value="0">Pending</option>
                    <option value="1">In Progress</option>
                    <option value="2">Completed</option>
                    <option value="3">Paused</option>
                    <option value="4">Rejected</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <Button colorScheme="orange" onClick={addSubtask}>
                    Add Sub Task
                  </Button>
                </FormControl>
              </HStack>
            </VStack>
            <Card shadow="none" marginTop={'3%'}>
              <CardHeader>
                <Heading size="md">Task List</Heading>
              </CardHeader>

              <CardBody>
                <Stack spacing="4">
                  {task?.subtasks?.map((task, i) => (
                    <Box border="1px" p={5} borderRadius={5} borderColor="#ccc">
                      <Flex justifyContent="space-between" marginBottom={3}>
                        <Heading size="xs" textTransform="uppercase">
                          {task.desp}
                        </Heading>
                        <Flex direction="column">
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
                          <Button
                            marginTop="10%"
                            size="sm"
                            colorScheme={
                              notesVisibility[task.id] ? 'red' : 'whatsapp'
                            }
                            onClick={() => toggleNotesVisibility(task.id)}
                          >
                            {notesVisibility[task.id] ? 'Cancel' : 'Add Notes'}
                          </Button>
                        </Flex>
                      </Flex>
                      {task?.notes?.map((note, i) => (
                        <>
                          <Divider></Divider>
                          <Card w={'100%'} shadow="none" marginTop={'1%'}>
                            <CardBody>
                              <Text>
                                <b>{note.user?.name}</b> (
                                {new Date(note.createdAt).toLocaleString()})
                              </Text>
                              <Text>{note.note}</Text>
                              {note.attachment && (
                                <Link
                                  style={{ color: 'blue' }}
                                  href={`https://blueteam.b-cdn.net/paktyping/${note.attachment}`}
                                  isExternal
                                >
                                  Attachment
                                </Link>
                              )}
                            </CardBody>
                          </Card>
                        </>
                      ))}

                      {notesVisibility[task.id] && (
                        <Box mt={4}>
                          <HStack spacing={4} w="100%">
                            <FormControl>
                              <FormLabel>Note</FormLabel>
                              <Textarea
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                placeholder="Add a note"
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel>File</FormLabel>
                              <Input
                                type="file"
                                onChange={(e) =>
                                  setFile(e.target.files?.[0] || null)
                                }
                              />
                            </FormControl>
                            <FormControl>
                              <Button
                                colorScheme="blue"
                                onClick={() => uploadFile()}
                              >
                                Add Note
                              </Button>
                            </FormControl>
                          </HStack>
                        </Box>
                      )}
                    </Box>
                  ))}
                </Stack>
              </CardBody>
            </Card>
          </div>
        </VStack>
      </Box>
    </CardMain>
  );
};

export default TaskDetail;
