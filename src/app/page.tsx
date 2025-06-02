'use client';

import { toaster } from '@/components/ui/toaster';
import { RepoInterface } from '@/interfaces/repo';
import { UserInterface } from '@/interfaces/user';
import { fetchUserRepos, fetchUsers } from '@/services/github';
import {
  Accordion,
  Box,
  Button,
  Card,
  CloseButton,
  EmptyState,
  Flex,
  Heading,
  Input,
  InputGroup,
  Span,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { LuLink, LuStar, LuUsersRound } from 'react-icons/lu';

export default function Home() {
  const [search, setSearch] = useState<string>('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<UserInterface | null>(null);
  const [data, setRepos] = useState<Record<string, RepoInterface[]>>({});

  const filterUsers = async (search: string) => {
    setIsLoading(true);
    try {
      const usersData = await fetchUsers(search);
      setUsers(usersData);
    } catch (error) {
      toaster.create({
        title: 'Error',
        description: `Error fetching users:', ${error}`,
        type: 'error',
      });
    }
  };

  useEffect(() => {
    const fetchAllRepos = async () => {
      if (!users?.items) return;

      try {
        const reposPerUser = await Promise.all(
          users.items.map(async (user) => {
            const repos = await fetchUserRepos(user.login);
            return { username: user.login, repos };
          })
        );

        const grouped: Record<string, RepoInterface[]> = {};
        reposPerUser.forEach(({ username, repos }) => {
          grouped[username] = repos;
        });

        setRepos(grouped);
      } catch (error) {
        toaster.create({
          title: 'Error',
          description: `Error fetching repos:', ${error}`,
          type: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllRepos();
  }, [users]);

  useEffect(() => {
    if (!search) {
      setUsers(null);
      setRepos({});
    }
  }, [search]);

  return (
    <Box width={'100%'} spaceY={4}>
      <Flex justifyContent={'space-between'} alignItems={'center'}>
        <Heading>GitHub Repositories Explorer</Heading>
        <LuLink
          size={16}
          onClick={() =>
            window.open(
              'https://github.com/stephanie-gh/GitHub-repositories-explorer'
            )
          }
        />
      </Flex>

      <Box spaceY={2}>
        <InputGroup
          flex="1"
          endElement={
            search && (
              <CloseButton
                color={'black'}
                onClick={() => {
                  setSearch('');
                  inputRef.current?.focus();
                }}
                bg={'transparent'}
              />
            )
          }
        >
          <Input
            fontSize={'md'}
            placeholder="Enter username.."
            px={2}
            py={4}
            ref={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDownCapture={(e) => e.key === 'Enter' && filterUsers(search)}
          />
        </InputGroup>
        <Button
          bg={'blue.solid'}
          color={'white'}
          width={'100%'}
          fontWeight={'semibold'}
          onClick={() => filterUsers(search)}
          disabled={isLoading}
        >
          {isLoading ? <Spinner size="sm" color="white" mr={2} /> : 'Search'}
        </Button>
      </Box>

      {users && users?.items?.length > 0 && !isLoading ? (
        <Box spaceY={4}>
          <Text opacity={0.8}>
            Showing repositories for "<strong>{search}</strong>"
          </Text>

          <Accordion.Root variant="plain" collapsible spaceY={2}>
            {users?.items.map((user) => (
              <Accordion.Item key={user.login} value={user.login} bg="gray.50">
                <Accordion.ItemTrigger bg="gray.200" p={4}>
                  <Span flex="1">{`${user.login} (${
                    (data[user.login] ?? []).length
                  } repos)`}</Span>
                  <Accordion.ItemIndicator />
                </Accordion.ItemTrigger>

                <Accordion.ItemContent py={4}>
                  <Accordion.ItemBody
                    spaceY={4}
                    maxHeight="450px"
                    overflowY="auto"
                  >
                    {(data[user.login] ?? []).length > 0 ? (
                      (data[user.login] ?? []).map((repo) => (
                        <Card.Root
                          key={repo.id}
                          size="md"
                          bg="gray.100"
                          p={4}
                          spaceY={2}
                        >
                          <Card.Header>
                            <Flex
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Heading
                                size="md"
                                color="black"
                                fontWeight="semibold"
                              >
                                {repo.name}
                              </Heading>
                              <Flex gapX={2} alignItems="center">
                                <Text color="black">
                                  {repo.stargazers_count}
                                </Text>
                                <LuStar color="black" fill="black" />
                              </Flex>
                            </Flex>
                          </Card.Header>
                          <Card.Body
                            color="black"
                            opacity={repo.description ? undefined : 0.5}
                          >
                            {repo.description || 'No description available.'}
                          </Card.Body>
                        </Card.Root>
                      ))
                    ) : (
                      <Text opacity={0.6} px={4}>
                        No repositories found for this user.
                      </Text>
                    )}
                  </Accordion.ItemBody>
                </Accordion.ItemContent>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </Box>
      ) : users && users?.items?.length <= 0 && search ? (
        <VStack minH={'64vh'} justifyContent={'center'} alignItems={'center'}>
          <EmptyState.Root size={'sm'}>
            <EmptyState.Content>
              <EmptyState.Indicator>
                <LuUsersRound />
              </EmptyState.Indicator>
              <VStack textAlign="center">
                <EmptyState.Title>No users found</EmptyState.Title>
                <EmptyState.Description>
                  Try searching for a different username
                </EmptyState.Description>
              </VStack>
            </EmptyState.Content>
          </EmptyState.Root>
        </VStack>
      ) : (
        <VStack minH={'64vh'} justifyContent={'center'} alignItems={'center'}>
          <EmptyState.Root size={'sm'}>
            <EmptyState.Content>
              <EmptyState.Indicator>
                <LuUsersRound />
              </EmptyState.Indicator>
              <VStack textAlign="center">
                <EmptyState.Title>Enter a username to search</EmptyState.Title>
                <EmptyState.Description>
                  Type a GitHub username above to see their repositories
                </EmptyState.Description>
              </VStack>
            </EmptyState.Content>
          </EmptyState.Root>
        </VStack>
      )}
    </Box>
  );
}
