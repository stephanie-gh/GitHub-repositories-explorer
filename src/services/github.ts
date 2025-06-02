export const fetchUserRepos = async (username: string) => {
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos`);

    if (!res.ok) {
      const error = new Error(
        `Failed to fetch repositories for user: ${username}`
      );
      // @ts-expect-error status does not exist on Error type
      error.status = res.status;
      throw error;
    }

    return res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error(`Failed to fetch repositories for user: ${username}`);
  }
};

export const fetchUsers = async (query: string) => {
  try {
    const res = await fetch(
      `https://api.github.com/search/users?q=${query}&per_page=5`
    );

    if (!res.ok) {
      const error = new Error(`Failed to fetch users`);
      // @ts-expect-error status does not exist on Error type
      error.status = res.status;
      throw error;
    }

    return res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error(`Failed to fetch users`);
  }
};
