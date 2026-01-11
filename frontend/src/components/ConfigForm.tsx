import { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Alert } from './ui/Alert';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Checkbox } from './ui/Checkbox';
import { useConfigStructured, useUpdateConfigStructured } from '../hooks/useConfig';
import { Save, RotateCcw, Loader2 } from 'lucide-react';
import type { ServerInfo } from '../api/types';

const worldSizeOptions = [
  { value: '', label: '请选择' },
  { value: 'small', label: '小型' },
  { value: 'medium', label: '中型' },
  { value: 'large', label: '大型' },
];

const difficultyOptions = [
  { value: '', label: '请选择' },
  { value: 'classic', label: '经典' },
  { value: 'expert', label: '专家' },
  { value: 'master', label: '大师' },
  { value: 'journey', label: '旅程' },
];

const priorityOptions = [
  { value: '0', label: '实时 (Realtime)' },
  { value: '1', label: '高 (High)' },
  { value: '2', label: '高于正常 (Above Normal)' },
  { value: '3', label: '正常 (Normal)' },
  { value: '4', label: '低于正常 (Below Normal)' },
  { value: '5', label: '空闲 (Idle)' },
];

const languageOptions = [
  { value: '', label: '请选择' },
  { value: 'en-US', label: 'English' },
  { value: 'de-DE', label: 'German (德语)' },
  { value: 'it-IT', label: 'Italian (意大利语)' },
  { value: 'fr-FR', label: 'French (法语)' },
  { value: 'es-ES', label: 'Spanish (西班牙语)' },
  { value: 'ru-RU', label: 'Russian (俄语)' },
  { value: 'zh-Hans', label: 'Chinese (简体中文)' },
  { value: 'pt-BR', label: 'Portuguese (葡萄牙语)' },
  { value: 'pl-PL', label: 'Polish (波兰语)' },
];

export function ConfigForm() {
  const { data, isLoading } = useConfigStructured();
  const updateMutation = useUpdateConfigStructured();
  const [config, setConfig] = useState<Partial<ServerInfo>>({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (data) {
      setConfig(data);
      setIsDirty(false);
    }
  }, [data]);

  const handleChange = (field: keyof ServerInfo, value: string | number | boolean) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = () => {
    updateMutation.mutate(config, {
      onSuccess: () => {
        setIsDirty(false);
      },
    });
  };

  const handleReset = () => {
    if (data) {
      setConfig(data);
      setIsDirty(false);
    }
  };

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">表单配置</h3>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleReset}
              disabled={!isDirty || isLoading}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              重置
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!isDirty || updateMutation.isPending}
              className="flex items-center gap-2"
            >
              {updateMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              保存
            </Button>
          </div>
        </div>

        {isDirty && (
          <Alert variant="warning">
            配置已修改但未保存，请点击"保存"按钮保存更改
          </Alert>
        )}

        {updateMutation.isSuccess && (
          <Alert variant="success">配置保存成功！</Alert>
        )}

        {updateMutation.isError && (
          <Alert variant="error">
            保存失败：{(updateMutation.error as Error).message}
          </Alert>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-96 bg-slate-50 rounded-lg">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="端口"
              type="number"
              value={config.port || ''}
              onChange={(e) => handleChange('port', parseInt(e.target.value) || 0)}
            />
            <Input
              label="最大玩家数"
              type="number"
              value={config.maxPlayers || ''}
              onChange={(e) => handleChange('maxPlayers', parseInt(e.target.value) || 0)}
            />
            <Input
              label="世界名称"
              value={config.worldName || ''}
              onChange={(e) => handleChange('worldName', e.target.value)}
            />
            <Input
              label="世界路径"
              value={config.worldPath || ''}
              onChange={(e) => handleChange('worldPath', e.target.value)}
            />
            <Select
              label="世界大小"
              options={worldSizeOptions}
              value={config.worldSize || ''}
              onChange={(e) => handleChange('worldSize', e.target.value)}
            />
            <Select
              label="难度"
              options={difficultyOptions}
              value={config.difficulty || ''}
              onChange={(e) => handleChange('difficulty', e.target.value)}
            />
            <Input
              label="世界种子"
              value={config.seed || ''}
              onChange={(e) => handleChange('seed', e.target.value)}
            />
            <Input
              label="密码"
              type="password"
              value={config.password || ''}
              onChange={(e) => handleChange('password', e.target.value)}
            />
            <Select
              label="语言"
              options={languageOptions}
              value={config.language || ''}
              onChange={(e) => handleChange('language', e.target.value)}
              className="md:col-span-2"
            />
            <Input
              label="MOTD (每日消息)"
              value={config.motd || ''}
              onChange={(e) => handleChange('motd', e.target.value)}
              className="md:col-span-2"
            />

            <div className="md:col-span-2 pt-4 border-t border-terra-wood-dark">
              <h4 className="text-sm font-semibold text-slate-200 mb-3">高级设置</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Checkbox
                  label="作弊保护 (Secure)"
                  description="启用额外的反作弊保护"
                  checked={config.secure || false}
                  onChange={(e) => handleChange('secure', e.target.checked)}
                />
                <Checkbox
                  label="UPnP 端口转发"
                  description="自动进行端口转发"
                  checked={config.upnp || false}
                  onChange={(e) => handleChange('upnp', e.target.checked)}
                />
                <Select
                  label="进程优先级 (Priority)"
                  options={priorityOptions}
                  value={String(config.priority || 3)}
                  onChange={(e) => handleChange('priority', parseInt(e.target.value))}
                />
                <Input
                  label="NPC 同步频率 (NPCStream)"
                  type="number"
                  value={config.npcstream || 60}
                  onChange={(e) => handleChange('npcstream', parseInt(e.target.value) || 60)}
                  placeholder="60"
                />
                <Input
                  label="世界备份保留数量"
                  type="number"
                  value={config.worldRollbacksToKeep || 2}
                  onChange={(e) => handleChange('worldRollbacksToKeep', parseInt(e.target.value) || 2)}
                  placeholder="2"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
