"use client"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { PlusCircle} from 'lucide-react'
import { WrenchIcon } from 'lucide-react'
import { BlocksIcon } from 'lucide-react'
import {FramerIcon} from 'lucide-react'

interface Task {
  name: string;
  pluginName: string;
  pluginVersion: string;
  pluginParams: { key: string; value: string }[];
}

interface Plugin {
  name: string;
  version: number;
  params: { key: string; value: string }[];
}

export default function PluginManagement() {
  const [pluginName, setPluginName] = useState('')
  const [templateName, setTemplateName] = useState('')
  const [url, setUrl] = useState('')
  const [timeout, setTimeout] = useState('')
  const [paramsType, setParamsType] = useState('')
  const [createdPlugins, setCreatedPlugins] = useState<string[]>([])
  const [createdTemplates, setCreatedTemplates] = useState<string[]>([])
  const [params, setParams] = useState<Array<{variable: string, description: string, valueType: string, required: boolean}>>([])
  const [activeSection, setActiveSection] = useState('plugin') // 'system' or 'plugin'
  const [tasks, setTasks] = useState<Task[]>([])
  const [plugins, setPlugins] = useState<Plugin[]>([])
  const [baselineParams, setBaselineParams] = useState<string[]>(["procfs_printk","procfs_sysrq","procfs_panic","procfs_kmsg","procfs_dmesg","procfs_console","procfs_loglevel"])
  

  const handleCreatePlugin = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('正在创建插件:', { pluginName })
    setCreatedPlugins(prev => [...prev, pluginName])
    setPluginName('') // Clear the input after creating
  }
  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('正在创建规则集模板:', { templateName })
    setCreatedTemplates(prev => [...prev, templateName])
    setTemplateName('') // Clear the input after creating
  }
  const handleAddTemplateVersion = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('正在添加规则集模板版本:', { templateName })
  }
  const handleAddVersion = (e: React.FormEvent) => {
    e.preventDefault()
   
    let version = 1;
    const existingPlugins = plugins.filter(plugin => plugin.name === pluginName);
    if (existingPlugins.length > 0) {
      const maxVersionPlugin = existingPlugins.reduce((max, plugin) => plugin.version > max.version ? plugin : max, existingPlugins[0]);
      version = maxVersionPlugin.version + 1;
    }
    setPlugins([...plugins, { name: pluginName, version: version, params: params.map(param => ({ key: param.variable, value: param.valueType })) }])
    console.log('正在添加版本:', { 
      pluginName, version, params
    })
  }

  const handleAddParam = () => {
    setParams([...params, { variable: '', description: '', valueType: '', required: false }])
  }

  const handleParamChange = (index: number, field: string, value: string | boolean) => {
    const newParams = [...params]
    newParams[index] = { ...newParams[index], [field]: value }
    setParams(newParams)
  }

  const handleBaselineParamChange = (index: number, field: string, value: string | boolean) => {
    const newBaselineParams = [...baselineParams]
    newBaselineParams[index] = value as string
    setBaselineParams(newBaselineParams)
  }

  const addTask = () => {
    setTasks([...tasks, { name: '', pluginName: '', pluginVersion: '', pluginParams: [] }])
  }

  const addParam = () => {
    setParams([...params, { variable: '', description: '', valueType: '', required: false }])
  }

   const handleTaskChange = (index: number, field: keyof Task, value: string) => {
    const newTasks = [...tasks];
    newTasks[index] = { ...newTasks[index], [field]: value };
    setTasks(newTasks);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900 mb-6 px-4">DCOS 系统服务</h1>
        
        <nav className="space-y-2">
          <button 
            onClick={() => setActiveSection('plugin')}
            className={`w-full flex items-center rounded-lg transition-colors text-lg
              ${activeSection === 'plugin' 
                ? 'bg-gray-100 text-gray-900 font-medium' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
          >
            <BlocksIcon className="mr-2 h-6 w-6" />插件管理
          </button>
          <button 
            onClick={() => setActiveSection('template')}
            className={`w-full flex items-center rounded-lg transition-colors text-lg
              ${activeSection === 'template' 
                ? 'bg-gray-100 text-gray-900 font-medium' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
          >
            <FramerIcon className="mr-2 h-6 w-6" />模板管理
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        {activeSection === 'template' ? (
          <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center"><FramerIcon className="mr-2 h-10 w-10" />规则集模板管理</h2>
          <Tabs defaultValue="create" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="create" className="text-lg">创建规则集模板</TabsTrigger>
              <TabsTrigger value="version" className="text-lg">添加版本</TabsTrigger>
            </TabsList>
            <TabsContent value="create">
              <Card className="max-w-4xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-2xl">创建规则集模板</CardTitle>
                  <CardDescription>在DCOS中创建一个新规则集模板。</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateTemplate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="templateName" className="text-lg">规则集模板名称</Label>
                      <Input 
                        id="templateName" 
                        value={templateName} 
                        onChange={(e) => setTemplateName(e.target.value)} 
                        required 
                        className="text-lg"
                      />
                    </div>
                    <Button type="submit" className="w-full text-lg">创建规则集模板</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="version">
              <Card className="max-w-4xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-2xl">添加规则集模板版本</CardTitle>
                  <CardDescription>为现有规则集模板添加一个新版本的实现。</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddTemplateVersion} className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="versionTemplateName" className="text-lg">规则集模板名称</Label>
                        <Select 
                          value={templateName}
                          onValueChange={setTemplateName}
                        >
                          <SelectTrigger className="text-xs">
                            <SelectValue placeholder="选择一个规则集模板" />
                          </SelectTrigger>
                          <SelectContent>
                            {createdTemplates.map((template) => (
                              <SelectItem key={template} value={template}>
                                {template}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      </div>
                      <Button type="button" variant="outline" onClick={addTask} className="w-1/4">
                        <PlusCircle className="mr-2 h-4 w-4" /> 添加任务
                      </Button>
                      {tasks.map((task, index) => (
                        
        <div key={index} className="mb-4 p-4 border rounded">
          <div className="grid gap-4">
            <Label className="flex items-center">
              <WrenchIcon className="mr-2 h-4 w-4" />任务 {index + 1}
            </Label>
            <input
              type="text"
              value={task.name}
              onChange={(e) => handleTaskChange(index, 'name', e.target.value)}
              placeholder="任务名称"
              className="border p-2 rounded"
            />
            <Label>选择使用的插件</Label>
            <div className="grid  grid-cols-1 gap-4">
           <Select 
                            value={pluginName}
                            onValueChange={setPluginName}
                          >
                            <SelectTrigger className="text-sm">
                              <SelectValue placeholder="选择一个插件" />
                            </SelectTrigger>
                            <SelectContent>
                              {plugins.map((plugin) => (
                                <SelectItem key={plugin.name + plugin.version} value={plugin.name + plugin.version}>
                                  插件：{plugin.name}，版本：{plugin.version}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
            {/* <input
              type="text"
              value={task.pluginVersion}
              onChange={(e) => handleTaskChange(index, 'pluginVersion', e.target.value)}
              placeholder="插件版本"
              className="border p-2 rounded"
            /> */}
          </div>
          <Label>添加传入的参数</Label>
          <Button type="button" variant="outline" onClick={addParam} className="w-1/4">
                        <PlusCircle className="mr-2 h-4 w-4" /> 添加参数
                      </Button>
        <div className="grid  grid-cols-1 gap-4">
       
                      {params.map((param, index) => (
                        <div key={index} className="grid grid-cols-3 gap-4 items-center bg-gray-100 p-4 rounded-lg">
                           <Select 
                            value={param.variable}
                            onValueChange={(value) => handleParamChange(index, 'variable', value)}
                          >
                            <SelectTrigger className="text-sm">
                              <SelectValue placeholder="选择一个插件的变量" />
                            </SelectTrigger>
                            <SelectContent>
                              {plugins.map((plugin) => (
                                <SelectItem key={plugin.params[index].key} value={plugin.params[index].key}>
                                  选择变量：{plugin.params[index].key}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select 
                            value={param.variable}
                            onValueChange={(value) => handleBaselineParamChange(index, 'variable', value)}
                          >
                            <SelectTrigger className="text-sm">
                              <SelectValue placeholder="选择关联的基线变量" />
                            </SelectTrigger>
                            <SelectContent>
                              {baselineParams.map((param) => (
                                <SelectItem key={param} value={param}>
                                {param}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
        </div>
        </div>
        </div>
      ))}
                    <Button type="submit" className="w-full text-lg">添加版本</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center"><BlocksIcon className="mr-2 h-10 w-10" />插件管理</h2>
            <Tabs defaultValue="create" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                <TabsTrigger value="create" className="text-lg">创建插件</TabsTrigger>
                <TabsTrigger value="version" className="text-lg">添加版本</TabsTrigger>
              </TabsList>
              <TabsContent value="create">
                <Card className="max-w-4xl mx-auto">
                  <CardHeader>
                    <CardTitle className="text-2xl">创建插件</CardTitle>
                    <CardDescription>在DCOS中创建一个新插件。</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreatePlugin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="pluginName" className="text-lg">插件名称</Label>
                        <Input 
                          id="pluginName" 
                          value={pluginName} 
                          onChange={(e) => setPluginName(e.target.value)} 
                          required 
                          className="text-lg"
                        />
                      </div>
                      <Button type="submit" className="w-full text-lg">创建插件</Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="version">
                <Card className="max-w-4xl mx-auto">
                  <CardHeader>
                    <CardTitle className="text-2xl">添加插件版本</CardTitle>
                    <CardDescription>为已有的插件添加一个新版本的实现。</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddVersion} className="space-y-6">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="versionPluginName" className="text-lg">插件名称</Label>
                          <Select 
                            value={pluginName}
                            onValueChange={setPluginName}
                          >
                            <SelectTrigger className="text-xs">
                              <SelectValue placeholder="选择一个插件" />
                            </SelectTrigger>
                            <SelectContent>
                              {createdPlugins.map((plugin) => (
                                <SelectItem key={plugin} value={plugin}>
                                  {plugin}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Separator />
                        <Label htmlFor="versionPluginName" className="text-lg">基础配置<span className="text-red-500 ml-1">*</span></Label>
                        
                        <div className="space-y-2">
                          <Label htmlFor="url" className="text-xs">URL</Label>
                          <Input 
                            id="url" 
                            value={url} 
                            onChange={(e) => setUrl(e.target.value)} 
                            required 
                            className="text-lg"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="timeout" className="text-xs">插件执行超时时间</Label>
                          <Input 
                            id="timeout" 
                            type="number" 
                            value={timeout} 
                            onChange={(e) => setTimeout(e.target.value)} 
                            required 
                            className="text-lg"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="paramsType" className="text-xs">参数类型</Label>
                          <Input 
                            id="paramsType" 
                            value={paramsType} 
                            onChange={(e) => setParamsType(e.target.value)} 
                            required 
                            className="text-lg"
                          />
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <Label className="text-lg">插件支持的调用参数</Label>
                          <Button type="button" onClick={handleAddParam} variant="outline" className="w-1/4"><PlusCircle className="mr-2 h-4 w-4 text-xs" />添加参数</Button>
                        </div>
                        {params.map((param, index) => (
                          <div key={index} className="grid grid-cols-4 gap-4 items-center bg-gray-100 p-4 rounded-lg">
                            <Input 
                              placeholder="变量" 
                              value={param.variable} 
                              onChange={(e) => handleParamChange(index, 'variable', e.target.value)} 
                              className="text-xs"
                            />
                            <Input 
                              placeholder="描述" 
                              value={param.description} 
                              onChange={(e) => handleParamChange(index, 'description', e.target.value)} 
                              className="text-xs"
                            />
                            <Input 
                              placeholder="值类型" 
                              value={param.valueType} 
                              onChange={(e) => handleParamChange(index, 'valueType', e.target.value)} 
                              className="text-xs"
                            />
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id={`required-${index}`} 
                                checked={param.required} 
                                onCheckedChange={(checked) => handleParamChange(index, 'required', checked as boolean)} 
                              />
                              <Label htmlFor={`required-${index}`} className="text-xs">不支持空值</Label>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button type="submit" className="w-full text-lg">提交</Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}