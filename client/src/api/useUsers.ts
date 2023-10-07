import { useEffect, useState } from "react";
import { User } from "./interfaces";

function useUsers(): User[] {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers()
      .then((u) => setUsers(u))
      .catch((e) => console.error("An error occurred while reading users.", e));
  }, []);

  return users;
}

async function fetchUsers() {
  const res = await fetch(`http://localhost:5000/users`);

  if (!res.ok) {
    throw new Error("Error occurred while reading users.");
  }
  return res.json();
}

export { useUsers };
