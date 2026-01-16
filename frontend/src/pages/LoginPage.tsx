import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import { Castle, Swords, Loader2, ShieldCheck } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ username, password });
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || '登录失败，请检查用户名和密码');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-terra-bg to-terra-bg-light p-4">
      <div className="w-full max-w-md">
        <Card className="p-8 shadow-2xl">
          {/* 标题部分 */}
          <div className="text-center mb-8">
            <h1 className="terra-heading text-3xl mb-2 tracking-wider flex items-center justify-center gap-3">
              <Castle className="w-8 h-8" />
              Terraria Panel
            </h1>
            <p className="text-terra-gold text-sm font-bold uppercase tracking-widest border-b border-terra-wood pb-2 inline-block">
              服务器管理面板
            </p>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="mb-6">
              <Alert variant="error">
                <div>
                  <div className="font-bold text-terra-gold">登录失败</div>
                  <div>{error}</div>
                </div>
              </Alert>
            </div>
          )}

          {/* 登录表单 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="用户名"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
              required
              disabled={isSubmitting}
            />

            <Input
              label="密码"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              required
              disabled={isSubmitting}
            />

            <Button
              type="submit"
              size="lg"
              className="w-full mt-8 flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  正在登录...
                </>
              ) : (
                <>
                  <Swords className="w-5 h-5" />
                  进入世界
                </>
              )}
            </Button>
          </form>

          {/* 底部信息 */}
          <div className="mt-6 text-center text-terra-wood text-sm flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <p>安全认证登录</p>
          </div>
        </Card>
      </div>
    </div>
  );
}