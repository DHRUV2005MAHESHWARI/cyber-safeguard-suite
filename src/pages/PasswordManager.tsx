
import React, { useState } from 'react';
import { Key, Plus, Copy, RefreshCw, EyeOff, Eye, Check, AlertTriangle, X } from 'lucide-react';
import { useSecurity } from '@/context/SecurityContext';
import { usePasswordStrength, PasswordEntry } from '@/hooks/usePasswordStrength';
import CardContainer from '@/components/CardContainer';
import StatusBadge from '@/components/StatusBadge';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const PasswordManager = () => {
  const { passwordStatus } = useSecurity();
  const { 
    passwordEntries, 
    generatePassword, 
    checkPasswordStrength,
    getStatusFromScore,
    addPasswordEntry 
  } = usePasswordStrength();
  
  const [passwordLength, setPasswordLength] = useState(16);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form state
  const [newService, setNewService] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const handleGenerate = () => {
    const password = generatePassword(passwordLength, includeSymbols);
    setGeneratedPassword(password);
    setPasswordStrength(checkPasswordStrength(password));
  };
  
  const handleCopyPassword = () => {
    navigator.clipboard.writeText(generatedPassword);
    toast.success('Password copied to clipboard');
  };
  
  const handleAddPassword = () => {
    if (!newService || !newUsername || !newPassword) {
      toast.error('Please fill all fields');
      return;
    }
    
    addPasswordEntry(newService, newUsername, newPassword);
    setNewService('');
    setNewUsername('');
    setNewPassword('');
    setDialogOpen(false);
    toast.success('Password saved successfully');
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };
  
  const getPasswordAgeStatus = (date: Date) => {
    const ageInDays = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (ageInDays > 180) return 'critical';
    if (ageInDays > 90) return 'warning';
    return 'secure';
  };
  
  const getPasswordIcon = (strength: number) => {
    if (strength >= 70) return <Check className="w-5 h-5 text-green-500" />;
    if (strength >= 40) return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    return <X className="w-5 h-5 text-red-500" />;
  };
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <NavBar />
      
      <main className="container max-w-5xl px-6 pt-32 animate-fade-in">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Key className="w-8 h-8 text-primary" />
              Password Manager
            </h1>
            <p className="text-muted-foreground">
              Store, generate, and assess password security.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <StatusBadge status={passwordStatus} className="animate-fade-in" />
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Password
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Password</DialogTitle>
                  <DialogDescription>
                    Enter the details for the password you want to store.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="service">Service Name</Label>
                    <Input 
                      id="service" 
                      value={newService} 
                      onChange={(e) => setNewService(e.target.value)} 
                      placeholder="e.g. Gmail, Netflix"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input 
                      id="username" 
                      value={newUsername} 
                      onChange={(e) => setNewUsername(e.target.value)} 
                      placeholder="e.g. user@example.com"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"}
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        placeholder="Enter password"
                      />
                      <button 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  {newPassword && (
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1 text-sm">
                        <span>Password Strength</span>
                        <StatusBadge status={getStatusFromScore(checkPasswordStrength(newPassword))} />
                      </div>
                      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            checkPasswordStrength(newPassword) >= 70 ? 'bg-green-500' : 
                            checkPasswordStrength(newPassword) >= 40 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${checkPasswordStrength(newPassword)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddPassword}>Save Password</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <CardContainer className="p-6 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Password Generator</h3>
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <label htmlFor="password-length">Password Length: {passwordLength}</label>
                </div>
                <Slider 
                  id="password-length"
                  value={[passwordLength]} 
                  min={8} 
                  max={32} 
                  step={1}
                  onValueChange={(value) => setPasswordLength(value[0])} 
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="include-symbols"
                  checked={includeSymbols}
                  onCheckedChange={setIncludeSymbols}
                />
                <Label htmlFor="include-symbols">Include Special Characters</Label>
              </div>
              
              <div className="flex gap-3">
                <Button onClick={handleGenerate} className="gap-2 flex-1">
                  <RefreshCw className="w-4 h-4" />
                  Generate
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleCopyPassword} 
                  disabled={!generatedPassword}
                  className="gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </Button>
              </div>
              
              {generatedPassword && (
                <div className="mt-4 space-y-3">
                  <div className="relative">
                    <Input 
                      value={generatedPassword} 
                      readOnly 
                      type={showPassword ? "text" : "password"}
                      className="pr-10 font-mono"
                    />
                    <button 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <span>Password Strength</span>
                      <StatusBadge status={getStatusFromScore(passwordStrength)} />
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          passwordStrength >= 70 ? 'bg-green-500' : 
                          passwordStrength >= 40 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${passwordStrength}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContainer>
          
          <CardContainer className="p-6">
            <h3 className="text-lg font-semibold mb-4">Password Tips</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-500" />
                <span>Use at least 12 characters for stronger security.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-500" />
                <span>Mix uppercase and lowercase letters, numbers, and symbols.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-500" />
                <span>Avoid using easily guessable information like birthdays.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-500" />
                <span>Use different passwords for different accounts.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-500" />
                <span>Change passwords regularly, at least every 3-6 months.</span>
              </li>
            </ul>
          </CardContainer>
        </div>
        
        <CardContainer className="overflow-hidden">
          <h3 className="text-lg font-semibold p-6 pb-4">Stored Passwords</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-6 py-4 text-left font-medium">Service</th>
                  <th className="px-6 py-4 text-left font-medium">Username</th>
                  <th className="px-6 py-4 text-left font-medium">Password</th>
                  <th className="px-6 py-4 text-left font-medium">Strength</th>
                  <th className="px-6 py-4 text-left font-medium">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {passwordEntries.length > 0 ? (
                  passwordEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-muted/40 transition-colors animate-fade-in">
                      <td className="px-6 py-4">
                        <div className="font-medium">{entry.service}</div>
                      </td>
                      <td className="px-6 py-4">{entry.username}</td>
                      <td className="px-6 py-4 font-mono">{entry.password}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-secondary rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                entry.strength >= 70 ? 'bg-green-500' : 
                                entry.strength >= 40 ? 'bg-amber-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${entry.strength}%` }}
                            />
                          </div>
                          {getPasswordIcon(entry.strength)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span>{formatDate(entry.lastUpdated)}</span>
                          <StatusBadge status={getPasswordAgeStatus(entry.lastUpdated)} />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      No passwords stored yet. Click "Add Password" to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContainer>
      </main>
    </div>
  );
};

export default PasswordManager;
