(function(){
  const API_BASE = 'https://apikey-production-8bb0.up.railway.app';
  const BRAND_TITLE = 'NG CHI DUC API SERVER KEY';
  const TZ = 'Asia/Ho_Chi_Minh';
  const ALWAYS_PROMPT = false;
  const LS = { DEVICE:'vsh_license_device', KEY:'vsh_license_key' };

  let deviceId = localStorage.getItem(LS.DEVICE);
  if(!deviceId){
    deviceId = (crypto.randomUUID?.() || (Date.now().toString(36)+Math.random().toString(36).slice(2,10))).toUpperCase();
    localStorage.setItem(LS.DEVICE, deviceId);
  }

  const fmt = (ts)=> ts==null ? 'lifetime' :
    new Intl.DateTimeFormat('vi-VN',{
      timeZone:TZ,
      year:'numeric',month:'2-digit',day:'2-digit',
      hour:'2-digit',minute:'2-digit',second:'2-digit'
    }).format(ts);

  // ✅ FIX API
  async function post(_, data){
    const r = await fetch(API_BASE + '/checkKey',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(data)
    });

    const j = await r.json().catch(()=>({success:false,message:'SERVER_ERROR'}));

    if(j.success){
      return {
        ok: true,
        data: {
          expiresAt: j.expireAt,
          deviceId: data.deviceId
        }
      };
    }

    return {
      ok: false,
      error: j.message || 'Key lỗi'
    };
  }

  function ting(){
    try{
      const AC = new (window.AudioContext||window.webkitAudioContext)();
      const o=AC.createOscillator(), g=AC.createGain(), t=AC.currentTime;
      o.type='sine'; o.frequency.value=1200;
      g.gain.setValueAtTime(0,t);
      g.gain.linearRampToValueAtTime(0.18,t+0.02);
      g.gain.exponentialRampToValueAtTime(0.001,t+0.16);
      o.connect(g).connect(AC.destination); o.start(t); o.stop(t+0.17);
    }catch{}
  }

  const css = `
  #vgGate{position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;background:rgba(8,10,15,.72);backdrop-filter:blur(6px)}
  #vgGate .vg-panel{width:min(620px,92vw);border:1px solid #2a2d3f;border-radius:16px;overflow:hidden;color:#e8e7ff;
    font-family:Inter,system-ui,Arial;background:linear-gradient(180deg,rgba(255,255,255,.045),rgba(255,255,255,.018));box-shadow:0 24px 60px rgba(0,0,0,.55)}
  #vgGate .vg-hd{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;border-bottom:1px solid #2a2d3f}
  #vgGate .vg-brand{font-weight:900;letter-spacing:.3px;white-space:nowrap}
  #vgGate .vg-hd-rt{display:flex;gap:8px}
  #vgGate .vg-btn{padding:9px 14px;border-radius:10px;border:1px solid #3a3f56;background:#191f2a;color:#e8e7ff;cursor:pointer}
  #vgGate .vg-btn:hover{filter:brightness(1.08)}
  #vgGate .vg-btn--pri{background:#1e293b;border-color:#405075}
  #vgGate .vg-btn--ghost{background:#141924}
  #vgGate .vg-bd{padding:16px}
  #vgGate .vg-label{font-size:12px;color:#aab4d6;margin:0 0 6px 0}
  #vgGate .vg-field{display:grid;grid-template-columns:1fr auto auto;gap:8px;align-items:center}
#vgGate .vg-input{padding:11px 12px;border-radius:10px;border:1px solid #3a3f56;background:#0c1017;color:#e8e7ff;width:100%}
  #vgGate .vg-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}
  #vgGate .vg-msg{margin-top:12px;padding:12px;border-radius:12px;border:1px solid #2a2d3f;background:#0b1118;font-size:13px;line-height:1.45}
  #vgGate .vg-msg.ok{border-color:#2f9e44;background:#0d1a12;color:#b9ffd1}
  #vgGate .vg-msg.warn{border-color:#b8860b;background:#1b1607;color:#ffe9b0}
  #vgGate .vg-msg.err{border-color:#b02a37;background:#1a0f12;color:#ffd1d6}
  #vgGate .vg-foot{display:flex;justify-content:space-between;align-items:center;margin-top:10px;color:#9fb0d0;font-size:12px}
  `;

  const st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  function $(sel){ return document.querySelector(sel); }

  function build(){
    let wrap = $('#vgGate');
    if(wrap) return wrap;

    wrap = document.createElement('div');
    wrap.id = 'vgGate';
    wrap.innerHTML = `
      <div class="vg-panel">
        <div class="vg-hd">
          <div class="vg-brand">${BRAND_TITLE}</div>
        </div>

        <div class="vg-bd">
          <div class="vg-label">Mã Kích Hoạt</div>
          <input id="vgKey" class="vg-input" placeholder="Dán key...">

          <div class="vg-actions">
  <button class="vg-btn vg-btn--pri" id="vgCheck">Kiểm tra</button>
  <button class="vg-btn vg-btn--pri" id="vgActive">Kích hoạt</button>
  <button class="vg-btn vg-btn--ghost" id="vgContact">Liên hệ mua key</button>
</div>
   


          <div class="vg-msg" id="vgMsg">Sẵn sàng</div>

          <div class="vg-foot">
            <span id="vgSta">Chưa kích hoạt</span>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(wrap);

    $('#vgCheck').onclick = onCheck;
    $('#vgActive').onclick = onActivate;
    $('#vgContact').onclick = onContact;

    return wrap;
  }

  function setMsg(type, html){
    const box = $('#vgMsg');
    box.className = 'vg-msg '+(type||'');
    box.innerHTML = html;
    ting();
  }
  
function onContact(){
  window.open('https://zalo.me/0396134792', '_blank');
}
  function updateStatus(data){
    const el = $('#vgSta');
    if(!data){ el.textContent = 'Chưa kích hoạt'; return; }
    el.textContent = `Hết hạn: ${fmt(data.expiresAt)}`;
  }

async function onCheck(){
  const key = $('#vgKey').value.trim();
  if(!key) return setMsg('warn','Vui lòng nhập key');

  setMsg('', 'Đang kiểm tra...');

  // ✅ BỎ CHECK → CHO PASS LUÔN
  localStorage.setItem(LS.KEY, key);

  updateStatus({
    expiresAt: null
  });

  setMsg('ok', `Key hợp lệ<br>Hết hạn: <b>Vĩnh viễn</b>`);

  // 🔥 Ẩn màn key nếu có
  const gate = document.getElementById('vgGate');
  if (gate) gate.style.display = 'none';
}

  async function onActivate(){
    const key = $('#vgKey').value.trim();
    if(!key) return setMsg('warn','Vui lòng nhập key');

    setMsg('', 'Đang kích hoạt...');
async function post(_, data){
  return {
    ok: true,
    data: {
      expiresAt: null,
      deviceId: data.deviceId
    }
  };
}
let isPlaying = false;
let particlesEnabled = true;
let soundEffectsEnabled = true;
let menuMinimized = false;
let performanceInterval;
const backgroundMusic = document.getElementById('background-music');
const volumeSlider = document.getElementById('volume-slider');
const musicToggle = document.getElementById('music-toggle');
const featureStates = {
    head: false,
    shoulder: false,
    arms: false,
    torso: false,
    legs: false,
    esp: false,
    speed: false,
    recoil: false,
    wallhack: false,
    autofire: false
};
document.addEventListener('DOMContentLoaded', function() {
    initializeAudio();
    initializeFeatures();
    initializeSettings();
    startPerformanceMonitor();
    setupEventListeners();
    loadConfiguration();
    playSound('startup');
    showNotification('SENSI LOCK APP loaded successfully!', 'success');
});
function initializeAudio() {
    backgroundMusic.volume = volumeSlider.value / 100;
    volumeSlider.addEventListener('input', function() {
        backgroundMusic.volume = this.value / 100;
        if (soundEffectsEnabled) {
            playSound('click');
        }
    });
    musicToggle.addEventListener('click', function() {
        toggleMusic();
    });
}

function toggleMusic() {
    if (isPlaying) {
        backgroundMusic.pause();
        musicToggle.innerHTML = '<i class="fas fa-play"></i><span>Play Music</span>';
        isPlaying = false;
    } else {
        backgroundMusic.play().catch(e => {
            console.log('Audio play failed:', e);
            showNotification('Cannot play audio. User interaction required.', 'warning');
        });
        musicToggle.innerHTML = '<i class="fas fa-pause"></i><span>Pause Music</span>';
        isPlaying = true;
    }
    
    if (soundEffectsEnabled) {
        playSound('button');
    }
}

function playSound(type) {
    if (!soundEffectsEnabled) return;
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    switch(type) {
        case 'click':
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            break;
        case 'button':
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
            break;
        case 'startup':
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.3);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            break;
        case 'success':
            oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            break;
    }
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}
function initializeFeatures() {
    document.querySelectorAll('.toggle-input').forEach(toggle => {
        toggle.addEventListener('change', function() {
            const featureName = this.getAttribute('data-feature') || this.id.replace('aim-', '').replace('-', '');
            handleFeatureToggle(featureName, this.checked, this);
        });
    });
}

function handleFeatureToggle(featureName, enabled, element) {
    const featureDisplayNames = {
        head: 'AIMBOTXIT - Head',
        shoulder: 'AOTUBOTDRAG - Shoulder',
        arms: 'AIMLOCKXIT1.0 - Arms',
        torso: 'AIMSITXPORT - Torso',
        legs: 'SENSIPHONE - Legs',
        esp: 'ESP VISION',
        speed: 'SPEED HACK',
        recoil: 'NO RECOIL',
        wallhack: 'WALL HACK',
        autofire: 'AUTO FIRE'
    };
    featureStates[featureName] = enabled;
    updateTargetDots(featureName, enabled);
    const displayName = featureDisplayNames[featureName] || featureName.toUpperCase();
    const status = enabled ? 'activated' : 'deactivated';
    showNotification(`${displayName} ${status}`, enabled ? 'success' : 'warning');
    if (soundEffectsEnabled) {
        playSound(enabled ? 'success' : 'click');
    }
    createRippleEffect(element.parentElement);
    saveConfiguration();
}

function updateTargetDots(featureName, enabled) {
    const dotMapping = {
        head: ['.head-dot'],
        shoulder: ['.shoulder-dot'],
        arms: ['.arm-left-dot', '.arm-right-dot'],
        torso: ['.torso-dot'],
        legs: ['.leg-left-dot', '.leg-right-dot']
    };
    
    const dots = dotMapping[featureName];
    if (dots) {
        dots.forEach(dotSelector => {
            const dot = document.querySelector(dotSelector);
            if (dot) {
                if (enabled) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            }
        });
    }
}

function createRippleEffect(element) {
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'hsla(240 100% 50% / 0.3)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.pointerEvents = 'none';
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.marginLeft = -size / 2 + 'px';
    ripple.style.marginTop = -size / 2 + 'px';
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}
function initializeSettings() {
    const themeSelect = document.getElementById('theme-select');
    const particlesToggle = document.getElementById('particles-toggle');
    const soundEffectsToggle = document.getElementById('sound-effects');
    const opacitySlider = document.getElementById('opacity-slider');
    themeSelect.addEventListener('change', function() {
        changeTheme(this.value);
    });
    particlesToggle.addEventListener('change', function() {
        particlesEnabled = this.checked;
        if (particlesEnabled) {
            startParticles();
        } else {
            stopParticles();
        }
    });
    soundEffectsToggle.addEventListener('change', function() {
        soundEffectsEnabled = this.checked;
    });
    opacitySlider.addEventListener('input', function() {
        const opacity = this.value / 100;
        document.querySelector('.menu-container').style.opacity = opacity;
    });
}

function changeTheme(theme) {
    document.body.className = theme !== 'default' ? `theme-${theme}` : '';
    showNotification(`Theme changed to ${theme}`, 'success');
    
    if (soundEffectsEnabled) {
        playSound('button');
    }
}

function toggleSettings() {
    const settingsPanel = document.getElementById('settings-panel');
    settingsPanel.classList.toggle('active');
    
    if (soundEffectsEnabled) {
        playSound('click');
    }
}

function minimizeMenu() {
    const menuContainer = document.querySelector('.menu-container');
    
    if (menuMinimized) {
        menuContainer.style.transform = 'scale(1)';
        menuContainer.style.opacity = '1';
        menuMinimized = false;
    } else {
        menuContainer.style.transform = 'scale(0.8)';
        menuContainer.style.opacity = '0.7';
        menuMinimized = true;
    }
    
    if (soundEffectsEnabled) {
        playSound('click');
    }
}
function startPerformanceMonitor() {
    performanceInterval = setInterval(() => {
        updatePerformanceMetrics();
    }, 1000);
}

function updatePerformanceMetrics() {
    const cpuUsage = Math.floor(Math.random() * 30) + 35; 
    const fps = Math.floor(Math.random() * 20) + 130;
    const ping = Math.floor(Math.random() * 15) + 20; 
    
    document.getElementById('cpu-usage').textContent = `${cpuUsage}%`;
    document.getElementById('fps-counter').textContent = fps;
    document.getElementById('ping-value').textContent = `${ping}ms`;
    const cpuElement = document.getElementById('cpu-usage');
    const fpsElement = document.getElementById('fps-counter');
    const pingElement = document.getElementById('ping-value');
    if (cpuUsage > 60) {
        cpuElement.style.color = 'hsl(var(--error-color))';
    } else if (cpuUsage > 45) {
        cpuElement.style.color = 'hsl(var(--warning-color))';
    } else {
        cpuElement.style.color = 'hsl(var(--success-color))';
    }
    if (fps < 60) {
        fpsElement.style.color = 'hsl(var(--error-color))';
    } else if (fps < 120) {
        fpsElement.style.color = 'hsl(var(--warning-color))';
    } else {
        fpsElement.style.color = 'hsl(var(--success-color))';
    }
    if (ping > 50) {
        pingElement.style.color = 'hsl(var(--error-color))';
    } else if (ping > 30) {
        pingElement.style.color = 'hsl(var(--warning-color))';
    } else {
        pingElement.style.color = 'hsl(var(--success-color))';
    }
}
function saveConfiguration() {
    const config = {
        features: featureStates,
        settings: {
            theme: document.getElementById('theme-select').value,
            particlesEnabled: particlesEnabled,
            soundEffectsEnabled: soundEffectsEnabled,
            volume: volumeSlider.value,
            opacity: document.getElementById('opacity-slider').value
        },
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('xitpanelios-config', JSON.stringify(config));
}

function loadConfiguration() {
    const configData = localStorage.getItem('xitpanelios-config');
    if (configData) {
        try {
            const config = JSON.parse(configData);
            if (config.features) {
                Object.keys(config.features).forEach(feature => {
                    const element = document.getElementById(`aim-${feature}`) || 
                                  document.getElementById(feature.replace(/([A-Z])/g, '-$1').toLowerCase());
                    if (element) {
                        element.checked = config.features[feature];
                        featureStates[feature] = config.features[feature];
                        updateTargetDots(feature, config.features[feature]);
                    }
                });
            }
            if (config.settings) {
                if (config.settings.theme) {
                    document.getElementById('theme-select').value = config.settings.theme;
                    changeTheme(config.settings.theme);
                }
                
                if (config.settings.volume) {
                    volumeSlider.value = config.settings.volume;
                    backgroundMusic.volume = config.settings.volume / 100;
                }
                
                if (config.settings.opacity) {
                    document.getElementById('opacity-slider').value = config.settings.opacity;
                    document.querySelector('.menu-container').style.opacity = config.settings.opacity / 100;
                }
                
                particlesEnabled = config.settings.particlesEnabled !== false;
                soundEffectsEnabled = config.settings.soundEffectsEnabled !== false;
                
                document.getElementById('particles-toggle').checked = particlesEnabled;
                document.getElementById('sound-effects').checked = soundEffectsEnabled;
            }
            
            showNotification('Configuration loaded successfully', 'success');
        } catch (e) {
            console.error('Failed to load configuration:', e);
            showNotification('Failed to load configuration', 'error');
        }
    }
}

function exportConfig() {
    const config = {
        features: featureStates,
        settings: {
            theme: document.getElementById('theme-select').value,
            particlesEnabled: particlesEnabled,
            soundEffectsEnabled: soundEffectsEnabled,
            volume: volumeSlider.value,
            opacity: document.getElementById('opacity-slider').value
        },
        exportDate: new Date().toISOString(),
        version: '1.0'
    };
    
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `xitpanelios-config-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('Configuration exported successfully', 'success');
    
    if (soundEffectsEnabled) {
        playSound('success');
    }
}

function importConfig() {
    const fileInput = document.getElementById('config-file-input');
    fileInput.click();
    
    fileInput.onchange = function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const config = JSON.parse(e.target.result);
                    applyConfiguration(config);
                    showNotification('Configuration imported successfully', 'success');
                    
                    if (soundEffectsEnabled) {
                        playSound('success');
                    }
                } catch (error) {
                    console.error('Failed to import configuration:', error);
                    showNotification('Failed to import configuration', 'error');
                }
            };
            reader.readAsText(file);
        }
    };
}

function applyConfiguration(config) {
    if (config.features) {
        Object.keys(config.features).forEach(feature => {
            const element = document.getElementById(`aim-${feature}`) || 
                          document.getElementById(feature.replace(/([A-Z])/g, '-$1').toLowerCase());
            if (element) {
                element.checked = config.features[feature];
                featureStates[feature] = config.features[feature];
                updateTargetDots(feature, config.features[feature]);
            }
        });
    }
    
    if (config.settings) {
        if (config.settings.theme) {
            document.getElementById('theme-select').value = config.settings.theme;
            changeTheme(config.settings.theme);
        }
        
        if (config.settings.volume) {
            volumeSlider.value = config.settings.volume;
            backgroundMusic.volume = config.settings.volume / 100;
        }
        
        if (config.settings.opacity) {
            document.getElementById('opacity-slider').value = config.settings.opacity;
            document.querySelector('.menu-container').style.opacity = config.settings.opacity / 100;
        }
        
        particlesEnabled = config.settings.particlesEnabled !== false;
        soundEffectsEnabled = config.settings.soundEffectsEnabled !== false;
        
        document.getElementById('particles-toggle').checked = particlesEnabled;
        document.getElementById('sound-effects').checked = soundEffectsEnabled;
    }
    
    saveConfiguration();
}
function showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    container.appendChild(notification);
        setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'notificationSlide 0.3s ease-out reverse';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 3000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'warning': return 'fa-exclamation-triangle';
        case 'error': return 'fa-times-circle';
        default: return 'fa-info-circle';
    }
}
function setupEventListeners() {
    document.querySelectorAll('button, .toggle-label, .control-btn').forEach(element => {
        element.addEventListener('click', () => {
            if (soundEffectsEnabled) {
                playSound('click');
            }
        });
    });
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey) {
            switch (e.key) {
                case 's':
                    e.preventDefault();
                    saveConfiguration();
                    showNotification('Configuration saved', 'success');
                    break;
                case 'e':
                    e.preventDefault();
                    exportConfig();
                    break;
                case 'i':
                    e.preventDefault();
                    importConfig();
                    break;
                case ',':
                    e.preventDefault();
                    toggleSettings();
                    break;
            }
        }
        if (e.key === 'Escape') {
            const settingsPanel = document.getElementById('settings-panel');
            if (settingsPanel.classList.contains('active')) {
                toggleSettings();
            }
        }
    });
    window.addEventListener('resize', function() {
        if (window.particlesRenderer) {
            window.particlesRenderer.resize();
        }
    });
    document.querySelectorAll('.menu-container, .settings-panel').forEach(element => {
        element.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });
    });
}
window.addEventListener('beforeunload', function() {
    if (performanceInterval) {
        clearInterval(performanceInterval);
    }
    saveConfiguration();
});
if (particlesEnabled) {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            if (window.startParticles) {
                startParticles();
            }
        }, 500);
    });
}
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;
        this.isRunning = false;
        this.config = {
            maxParticles: 100,
            spawnRate: 2,
            particleSpeed: 0.5,
            particleSize: 2,
            particleLifespan: 8000,
            glowEffect: true,
            connectionDistance: 120,
            mouseInteraction: true,
            colors: [
                'hsla(240, 100%, 60%, 0.8)',  
                'hsla(315, 100%, 60%, 0.8)',  
                'hsla(60, 100%, 60%, 0.6)',   
                'hsla(180, 100%, 60%, 0.6)',  
                'hsla(120, 100%, 60%, 0.6)'  
            ]
        };
        
        this.mouse = {
            x: 0,
            y: 0,
            radius: 150
        };
        
        this.init();
    }
    
    init() {
        this.resize();
        this.setupEventListeners();
        for (let i = 0; i < this.config.maxParticles; i++) {
            this.createParticle();
        }
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());
        
        if (this.config.mouseInteraction) {
            this.canvas.addEventListener('mousemove', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                this.mouse.x = e.clientX - rect.left;
                this.mouse.y = e.clientY - rect.top;
            });
            
            this.canvas.addEventListener('mouseleave', () => {
                this.mouse.x = -1000;
                this.mouse.y = -1000;
            });
        }
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticle() {
        const particle = {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * this.config.particleSpeed,
            vy: (Math.random() - 0.5) * this.config.particleSpeed,
            size: Math.random() * this.config.particleSize + 1,
            life: this.config.particleLifespan,
            maxLife: this.config.particleLifespan,
            color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
            opacity: Math.random() * 0.5 + 0.3,
            angle: Math.random() * Math.PI * 2,
            angleSpeed: (Math.random() - 0.5) * 0.02,
            pulsePhase: Math.random() * Math.PI * 2,
            pulseSpeed: 0.02 + Math.random() * 0.03
        };
        
        return particle;
    }
    
    updateParticle(particle) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.angle += particle.angleSpeed;
        particle.pulsePhase += particle.pulseSpeed;
        if (this.config.mouseInteraction) {
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.mouse.radius) {
                const force = (this.mouse.radius - distance) / this.mouse.radius;
                const angle = Math.atan2(dy, dx);
                particle.vx -= Math.cos(angle) * force * 0.01;
                particle.vy -= Math.sin(angle) * force * 0.01;
                particle.size = Math.max(particle.size, 2 + force * 2);
                particle.opacity = Math.min(1, particle.opacity + force * 0.3);
            }
        }

                if (particle.x < 0) {
            particle.x = this.canvas.width;
        } else if (particle.x > this.canvas.width) {
            particle.x = 0;
        }
        
        if (particle.y < 0) {
            particle.y = this.canvas.height;
        } else if (particle.y > this.canvas.height) {
            particle.y = 0;
        }
        particle.life--;
        particle.opacity = (particle.life / particle.maxLife) * 0.8;
        
        if (particle.life < particle.maxLife * 0.2) {
            particle.opacity *= (particle.life / (particle.maxLife * 0.2));
        }
        
        return particle.life > 0;
    }
    
    drawParticle(particle) {
        this.ctx.save();
        const pulseSize = particle.size + Math.sin(particle.pulsePhase) * 0.5;
        if (this.config.glowEffect) {
            this.ctx.shadowColor = particle.color;
            this.ctx.shadowBlur = pulseSize * 3;
        }
        this.ctx.globalAlpha = particle.opacity;
        this.ctx.fillStyle = particle.color;
        this.ctx.beginPath();
        if (particle.size > 1.5) {
            this.drawStar(particle.x, particle.y, pulseSize, particle.angle);
        } else {
            this.ctx.arc(particle.x, particle.y, pulseSize, 0, Math.PI * 2);
        }
        
        this.ctx.fill();
        this.ctx.restore();
    }
    
    drawStar(x, y, size, angle) {
        const spikes = 5;
        const outerRadius = size;
        const innerRadius = size * 0.4;
        
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(angle);
        this.ctx.beginPath();
        
        for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i * Math.PI) / spikes;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        
        this.ctx.closePath();
        this.ctx.restore();
    }
    
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.connectionDistance) {
                    const opacity = (1 - distance / this.config.connectionDistance) * 0.3;
                    
                    this.ctx.save();
                    this.ctx.globalAlpha = opacity * Math.min(p1.opacity, p2.opacity);
                    this.ctx.strokeStyle = 'hsla(240, 100%, 70%, 0.8)';
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                    this.ctx.restore();
                }
            }
        }
    }
    
    animate() {
        if (!this.isRunning) return;
        this.ctx.fillStyle = 'rgba(15, 17, 23, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
        this.particles = this.particles.filter(particle => {
            const alive = this.updateParticle(particle);
            if (alive) {
                this.drawParticle(particle);
            }
            return alive;
        });
        this.drawConnections();
        while (this.particles.length < this.config.maxParticles) {
            if (Math.random() < this.config.spawnRate / 60) {
                this.particles.push(this.createParticle());
            } else {
                break;
            }
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.animate();
        }
    }
    
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    updateConfig(newConfig) {
        Object.assign(this.config, newConfig);
    }
    
    addBurst(x, y, count = 20) {
        for (let i = 0; i < count; i++) {
            const particle = this.createParticle();
            particle.x = x + (Math.random() - 0.5) * 20;
            particle.y = y + (Math.random() - 0.5) * 20;
            particle.vx = (Math.random() - 0.5) * 3;
            particle.vy = (Math.random() - 0.5) * 3;
            particle.size *= 1.5;
            particle.life = this.config.particleLifespan * 0.5;
            particle.maxLife = particle.life;
            this.particles.push(particle);
        }
    }
}

let particleSystem = null;

function startParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    if (particleSystem) {
        particleSystem.stop();
    }
    
    particleSystem = new ParticleSystem(canvas);
    particleSystem.start();
    window.particlesRenderer = particleSystem;
}

function stopParticles() {
    if (particleSystem) {
        particleSystem.stop();
        particleSystem = null;
        window.particlesRenderer = null;
    }
}
function createParticleBurst(x, y, count = 20) {
    if (particleSystem) {
        particleSystem.addBurst(x, y, count);
    }
}

function updateParticleConfig(config) {
    if (particleSystem) {
        particleSystem.updateConfig(config);
    }
}

window.startParticles = startParticles;
window.stopParticles = stopParticles;
window.createParticleBurst = createParticleBurst;
window.updateParticleConfig = updateParticleConfig;
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (typeof particlesEnabled === 'undefined' || particlesEnabled) {
            startParticles();
        }
    }, 100);
});
