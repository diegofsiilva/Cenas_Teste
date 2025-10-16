import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Palette, Image, Save, RotateCcw, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';

export default function SettingsView() {
  const { visualSettings, setVisualSettings } = useApp();
  const [tempSettings, setTempSettings] = useState(visualSettings);
  const [darkMode, setDarkMode] = useState(false);

  const handleSave = () => {
    setVisualSettings(tempSettings);
    alert('Configurações salvas com sucesso!');
  };

  const handleReset = () => {
    const defaultSettings = {
      primaryColor: 'oklch(0.55 0.18 250)',
      secondaryColor: 'oklch(0.25 0.04 250)',
      logo: '',
      backgroundImage: ''
    };
    setTempSettings(defaultSettings);
    setVisualSettings(defaultSettings);
  };

  const presetColors = [
    { name: 'Azul Original', primary: 'oklch(0.55 0.18 250)', secondary: 'oklch(0.25 0.04 250)' },
    { name: 'Roxo', primary: 'oklch(0.55 0.18 290)', secondary: 'oklch(0.25 0.04 290)' },
    { name: 'Verde', primary: 'oklch(0.55 0.18 150)', secondary: 'oklch(0.25 0.04 150)' },
    { name: 'Vermelho', primary: 'oklch(0.55 0.18 30)', secondary: 'oklch(0.25 0.04 30)' },
    { name: 'Laranja', primary: 'oklch(0.65 0.18 60)', secondary: 'oklch(0.30 0.04 60)' },
    { name: 'Ciano', primary: 'oklch(0.60 0.18 200)', secondary: 'oklch(0.25 0.04 200)' },
  ];

  const applyPreset = (preset) => {
    setTempSettings({
      ...tempSettings,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Configurações Visuais</h2>
        <p className="text-muted-foreground">Personalize a aparência do sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel de configurações */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cores */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold">Esquema de Cores</h3>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="primaryColor">Cor Primária</Label>
                <div className="flex gap-3 mt-2">
                  <Input
                    id="primaryColor"
                    value={tempSettings.primaryColor}
                    onChange={(e) => setTempSettings({ ...tempSettings, primaryColor: e.target.value })}
                    placeholder="oklch(0.55 0.18 250)"
                  />
                  <div
                    className="w-20 h-10 rounded-md border-2 border-border"
                    style={{ backgroundColor: tempSettings.primaryColor }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Formato OKLCH: oklch(luminosidade saturação matiz)
                </p>
              </div>

              <div>
                <Label htmlFor="secondaryColor">Cor Secundária</Label>
                <div className="flex gap-3 mt-2">
                  <Input
                    id="secondaryColor"
                    value={tempSettings.secondaryColor}
                    onChange={(e) => setTempSettings({ ...tempSettings, secondaryColor: e.target.value })}
                    placeholder="oklch(0.25 0.04 250)"
                  />
                  <div
                    className="w-20 h-10 rounded-md border-2 border-border"
                    style={{ backgroundColor: tempSettings.secondaryColor }}
                  />
                </div>
              </div>

              <div>
                <Label className="mb-3 block">Presets de Cores</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {presetColors.map((preset, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => applyPreset(preset)}
                      className="justify-start gap-2"
                    >
                      <div className="flex gap-1">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: preset.primary }}
                        />
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: preset.secondary }}
                        />
                      </div>
                      <span className="text-xs">{preset.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Imagens */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <ImageIcon className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold">Imagens</h3>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="logo">URL do Logo</Label>
                <Input
                  id="logo"
                  type="url"
                  value={tempSettings.logo}
                  onChange={(e) => setTempSettings({ ...tempSettings, logo: e.target.value })}
                  placeholder="https://exemplo.com/logo.png"
                  className="mt-2"
                />
                {tempSettings.logo && (
                  <div className="mt-3">
                    <img
                      src={tempSettings.logo}
                      alt="Logo preview"
                      className="h-16 object-contain border border-border rounded-md p-2 bg-background"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="backgroundImage">URL da Imagem de Fundo</Label>
                <Input
                  id="backgroundImage"
                  type="url"
                  value={tempSettings.backgroundImage}
                  onChange={(e) => setTempSettings({ ...tempSettings, backgroundImage: e.target.value })}
                  placeholder="https://exemplo.com/background.jpg"
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  A imagem será aplicada com baixa opacidade no fundo
                </p>
                {tempSettings.backgroundImage && (
                  <div className="mt-3">
                    <img
                      src={tempSettings.backgroundImage}
                      alt="Background preview"
                      className="w-full h-32 object-cover rounded-md border border-border"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex gap-3">
            <Button onClick={handleSave} className="flex-1 gap-2">
              <Save className="w-4 h-4" />
              Salvar Configurações
            </Button>
            <Button onClick={handleReset} variant="outline" className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Restaurar Padrão
            </Button>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
            <h3 className="text-lg font-semibold mb-4">Preview</h3>
            
            <div className="space-y-4">
              {/* Preview de botões */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Botão Primário</p>
                <button
                  className="w-full px-4 py-2 rounded-md font-semibold text-white transition-colors"
                  style={{ backgroundColor: tempSettings.primaryColor }}
                >
                  Exemplo de Botão
                </button>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Botão Secundário</p>
                <button
                  className="w-full px-4 py-2 rounded-md font-semibold text-white transition-colors"
                  style={{ backgroundColor: tempSettings.secondaryColor }}
                >
                  Exemplo de Botão
                </button>
              </div>

              {/* Preview de card */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Card com Borda</p>
                <div
                  className="border-2 rounded-lg p-4"
                  style={{ borderColor: tempSettings.primaryColor }}
                >
                  <p className="font-semibold mb-2">Mesa 1</p>
                  <p className="text-sm text-muted-foreground">Exemplo de card</p>
                  <div
                    className="w-3 h-3 rounded-full mt-2"
                    style={{ backgroundColor: tempSettings.primaryColor }}
                  />
                </div>
              </div>

              {/* Preview de badge */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Badge de Categoria</p>
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-semibold border"
                  style={{
                    backgroundColor: `${tempSettings.primaryColor}20`,
                    color: tempSettings.primaryColor,
                    borderColor: `${tempSettings.primaryColor}50`
                  }}
                >
                  Bebidas
                </span>
              </div>

              {/* Preview de gradiente */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Gradiente</p>
                <div
                  className="h-20 rounded-lg"
                  style={{
                    background: `linear-gradient(135deg, ${tempSettings.primaryColor}, ${tempSettings.secondaryColor})`
                  }}
                />
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground">
                💡 <strong>Dica:</strong> As cores serão aplicadas em toda a interface após salvar.
                Use os presets para testar diferentes combinações rapidamente.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Informações adicionais */}
      <div className="mt-6 bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3">Sobre o Sistema de Cores</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            Este sistema utiliza o espaço de cores <strong>OKLCH</strong>, que oferece melhor controle
            sobre luminosidade e saturação em comparação com RGB ou HSL.
          </p>
          <p>
            <strong>Formato:</strong> oklch(luminosidade saturação matiz)
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><strong>Luminosidade:</strong> 0 (preto) a 1 (branco)</li>
            <li><strong>Saturação:</strong> 0 (cinza) a 0.4 (muito saturado)</li>
            <li><strong>Matiz:</strong> 0-360 (ângulo no círculo de cores)</li>
          </ul>
          <p className="mt-3">
            <strong>Exemplos de matizes:</strong> 0=vermelho, 60=amarelo, 120=verde, 180=ciano, 240=azul, 300=magenta
          </p>
        </div>
      </div>
    </div>
  );
}

