import { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Alert } from './ui/Alert';
import { useConfig, useSaveConfig } from '../hooks/useConfig';
import { Save, RotateCcw, Loader2 } from 'lucide-react';

export function ConfigEditor() {
  const { data, isLoading } = useConfig();
  const saveMutation = useSaveConfig();
  const [config, setConfig] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (data?.config) {
      setConfig(data.config);
      setIsDirty(false);
    }
  }, [data]);

  const handleChange = (value: string) => {
    setConfig(value);
    setIsDirty(value !== data?.config);
  };

  const handleSave = () => {
    saveMutation.mutate(config, {
      onSuccess: () => {
        setIsDirty(false);
      },
    });
  };

  const handleReset = () => {
    if (data?.config) {
      setConfig(data.config);
      setIsDirty(false);
    }
  };

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">配置编辑器</h3>
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
              disabled={!isDirty || saveMutation.isPending}
              className="flex items-center gap-2"
            >
              {saveMutation.isPending ? (
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

        {saveMutation.isSuccess && (
          <Alert variant="success">配置保存成功！</Alert>
        )}

        {saveMutation.isError && (
          <Alert variant="error">
            保存失败：{(saveMutation.error as Error).message}
          </Alert>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-96 bg-slate-50 rounded-lg">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : (
          <textarea
            value={config}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full h-96 p-4 font-mono text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="配置内容..."
          />
        )}
      </div>
    </Card>
  );
}
