import { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Alert } from './ui/Alert';
import { Tabs } from './ui/Tabs';
import { useSendCommand } from '../hooks/useServerControl';
import {
  Save,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Send,
  Loader2,
  CloudRain,
  Wind,
  Droplets,
  Users,
  Skull,
  Heart,
  Eclipse,
  Snowflake,
  Sparkles,
  Swords,
  Zap,
  Trash2,
  Shield,
  Clock,
  Ghost,
  TreePine,
  Eye,
  Crown,
  Worm,
  Brain,
  Bone,
  Flame,
  Cog,
  Flower2,
  Mountain,
  Fish,
  CircleDot,
  Home,
  MapPin,
  List,
  Gauge,
  Bug,
  LogOut,
} from 'lucide-react';

const commandCategories = {
  time: [
    { cmd: 'save', label: '保存世界', icon: Save },
    { cmd: 'dawn', label: '黎明', icon: Sunrise },
    { cmd: 'noon', label: '中午', icon: Sun },
    { cmd: 'dusk', label: '黄昏', icon: Sunset },
    { cmd: 'midnight', label: '午夜', icon: Moon },
    { cmd: 'time', label: '查看时间', icon: Clock },
  ],
  weather: [
    { cmd: 'rain', label: '切换下雨', icon: CloudRain },
    { cmd: 'rain slime start', label: '史莱姆雨', icon: Droplets },
    { cmd: 'wind 0', label: '停风', icon: Wind },
    { cmd: 'settle', label: '安定液体', icon: Droplets },
  ],
  events: [
    { cmd: 'bloodmoon', label: '血月', icon: Skull },
    { cmd: 'fullmoon', label: '满月', icon: Moon },
    { cmd: 'eclipse', label: '日食', icon: Eclipse },
    { cmd: 'pumpkinmoon', label: '南瓜月', icon: Ghost },
    { cmd: 'snowmoon', label: '霜月', icon: Snowflake },
    { cmd: 'sandstorm', label: '沙尘暴', icon: Wind },
  ],
  invasion: [
    { cmd: 'invade goblin', label: '哥布林入侵', icon: Swords },
    { cmd: 'invade pirate', label: '海盗入侵', icon: Swords },
    { cmd: 'invade martian', label: '火星人入侵', icon: Zap },
    { cmd: 'invade frost', label: '霜月军团', icon: TreePine },
  ],
  admin: [
    { cmd: 'playing', label: '在线玩家', icon: Users },
    { cmd: 'heal', label: '治愈全员', icon: Heart },
    { cmd: 'butcher', label: '清除敌怪', icon: Skull },
    { cmd: 'clearitems', label: '清除掉落物', icon: Trash2 },
    { cmd: 'godmode', label: '无敌模式', icon: Shield },
    { cmd: 'hardmode', label: '困难模式', icon: Sparkles },
    { cmd: 'exit', label: '关闭服务器', icon: LogOut },
  ],
  bossNormal: [
    { cmd: 'king', label: '史莱姆王', icon: Crown },
    { cmd: 'eye', label: '克苏鲁之眼', icon: Eye },
    { cmd: 'eater', label: '世界吞噬者', icon: Worm },
    { cmd: 'brain', label: '克苏鲁之脑', icon: Brain },
    { cmd: 'skeletron', label: '骷髅王', icon: Bone },
    { cmd: 'wof', label: '血肉墙', icon: Flame },
  ],
  bossHard: [
    { cmd: 'spawnboss destroyer', label: '毁灭者', icon: Worm },
    { cmd: 'spawnboss twins', label: '双子魔眼', icon: Eye },
    { cmd: 'spawnboss prime', label: '机械骷髅王', icon: Cog },
    { cmd: 'spawnboss plantera', label: '世纪之花', icon: Flower2 },
    { cmd: 'spawnboss golem', label: '石巨人', icon: Mountain },
    { cmd: 'spawnboss dukefishron', label: '猪鲨公爵', icon: Fish },
    { cmd: 'spawnboss moon', label: '月亮领主', icon: CircleDot },
  ],
  teleport: [
    { cmd: 'spawn', label: '传送出生点', icon: MapPin },
    { cmd: 'home', label: '传送个人点', icon: Home },
    { cmd: 'warp list', label: '传送点列表', icon: List },
  ],
  spawn: [
    { cmd: 'maxspawns 10', label: '最大生成10', icon: Bug },
    { cmd: 'maxspawns 5', label: '最大生成5', icon: Bug },
    { cmd: 'spawnrate 300', label: '生成率快', icon: Gauge },
    { cmd: 'spawnrate 900', label: '生成率慢', icon: Gauge },
  ],
};

export function QuickActions() {
  const [message, setMessage] = useState('');
  const [pendingCmd, setPendingCmd] = useState<string | null>(null);
  const sendMutation = useSendCommand();

  const handleQuickCommand = (cmd: string) => {
    setPendingCmd(cmd);
    sendMutation.mutate(cmd, {
      onSettled: () => setPendingCmd(null),
    });
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    setPendingCmd('say');
    sendMutation.mutate(`say ${message}`, {
      onSuccess: () => setMessage(''),
      onSettled: () => setPendingCmd(null),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderButtons = (commands: typeof commandCategories.time) => (
    <div className="flex flex-wrap gap-2">
      {commands.map(({ cmd, label, icon: Icon }) => (
        <Button
          key={cmd}
          size="sm"
          variant="secondary"
          onClick={() => handleQuickCommand(cmd)}
          disabled={sendMutation.isPending}
          className="flex items-center gap-2"
        >
          {pendingCmd === cmd ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Icon className="w-4 h-4" />
          )}
          {label}
        </Button>
      ))}
    </div>
  );

  const tabs = [
    { id: 'time', label: '时间', content: renderButtons(commandCategories.time) },
    { id: 'weather', label: '天气', content: renderButtons(commandCategories.weather) },
    { id: 'events', label: '事件', content: renderButtons(commandCategories.events) },
    { id: 'invasion', label: '入侵', content: renderButtons(commandCategories.invasion) },
    { id: 'admin', label: '管理', content: renderButtons(commandCategories.admin) },
    { id: 'bossNormal', label: 'Boss-普通', content: renderButtons(commandCategories.bossNormal) },
    { id: 'bossHard', label: 'Boss-困难', content: renderButtons(commandCategories.bossHard) },
    { id: 'teleport', label: '传送', content: renderButtons(commandCategories.teleport) },
    { id: 'spawn', label: '生成', content: renderButtons(commandCategories.spawn) },
  ];

  return (
    <Card>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">快捷操作</h3>

        {sendMutation.isSuccess && (
          <Alert variant="success">命令执行成功！</Alert>
        )}

        {sendMutation.isError && (
          <Alert variant="error">
            执行失败：{(sendMutation.error as Error).message}
          </Alert>
        )}

        <Tabs tabs={tabs} defaultTab="time" />

        <div className="pt-2 border-t border-terra-wood-dark">
          <p className="text-sm font-medium text-slate-200 mb-2">发送消息</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入要广播的消息..."
              className="terra-input flex-1 px-4 py-2"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || sendMutation.isPending}
              className="flex items-center gap-2"
            >
              {pendingCmd === 'say' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              发送
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
