import { useState } from 'react';
import { ConfigEditor } from '../components/ConfigEditor';
import { ConfigForm } from '../components/ConfigForm';
import { Button } from '../components/ui/Button';
import { FileText, FormInput } from 'lucide-react';

export function ConfigPage() {
  const [mode, setMode] = useState<'form' | 'text'>('form');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="terra-heading text-3xl">服务器配置</h1>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={mode === 'form' ? 'primary' : 'secondary'}
            onClick={() => setMode('form')}
            className="flex items-center gap-2"
          >
            <FormInput className="w-4 h-4" />
            表单模式
          </Button>
          <Button
            size="sm"
            variant={mode === 'text' ? 'primary' : 'secondary'}
            onClick={() => setMode('text')}
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            文本模式
          </Button>
        </div>
      </div>
      {mode === 'form' ? <ConfigForm /> : <ConfigEditor />}
    </div>
  );
}
