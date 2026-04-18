function capitalizeString(string) {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

const UserProfileCard = ({ useSession }) => {
  const { data: session, status } = useSession();

  return (
    <div className="bg-neutral-800 rounded-sm p-4">
      {status === "loading" ? (
        "Loading username..."
      ) : status === "unauthenticated" ? (
        "Access Denied"
      ) : (
        <p>
          Logged in as <strong>{capitalizeString(session?.user?.name)}</strong>
        </p>
      )}
    </div>
  );
};

export default UserProfileCard;
