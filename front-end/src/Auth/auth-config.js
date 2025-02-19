export default function setAuthorisationHeader(user) {
  if (!user) return;
  const configuration = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  return configuration;
}
