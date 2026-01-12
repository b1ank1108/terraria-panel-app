import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // 认证状态检查中，显示加载界面
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-terra-bg">
        <div className="terra-card p-8 text-center">
          <div className="terra-heading text-xl text-terra-gold mb-4">
            🔄 正在检查认证状态...
          </div>
          <div className="text-terra-wood">
            请稍候，正在验证您的登录信息
          </div>
        </div>
      </div>
    );
  }

  // 未认证，重定向到登录页
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 已认证，渲染子路由
  return <Outlet />;
}