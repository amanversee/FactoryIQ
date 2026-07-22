import useAuthStore from '../store/authStore';
import UnauthorizedPage from '../pages/UnauthorizedPage';

export default function RoleGuard({ allowedRoles, children }) {
  const { user } = useAuthStore();

  if (!user || !allowedRoles.includes(user.role)) {
    return <UnauthorizedPage requiredRoles={allowedRoles} />;
  }

  return children;
}
