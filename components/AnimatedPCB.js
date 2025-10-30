import React from 'react'

const AnimatedPCB = () => {
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [beamActive, setBeamActive] = useState(false);
  const [hoveredComponent, setHoveredComponent] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    let animationId;

    // Retro PCB Colors
    const colors = {
      pcbGreen: '#199f4b',
      soldermask: '#1a5f3a',
      copper: '#d4a574',
      copperDark: '#b8864f',
      gold: '#f3c32d',
      silver: '#c0c0c0',
      yellow: '#f3c32d',
      orange: '#ff6b35',
      red: '#e63946',
      blue: '#457b9d',
      brown: '#8b4513',
      black: '#1d1d1d'
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Circuit node (solder pads)
    class Node {
      constructor(x, y, type = 'normal') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.pulse = Math.random() * Math.PI * 2;
        this.connections = [];
        this.active = false;
        this.charge = 0;
      }

      update() {
        this.pulse += 0.02;
        if (this.charge > 0) this.charge *= 0.95;
      }

      draw(ctx) {
        const pulseSize = Math.sin(this.pulse) * 1 + 4;
        
        // Solder pad
        ctx.shadowBlur = this.active || this.charge > 0 ? 15 : 5;
        ctx.shadowColor = this.active ? colors.gold : colors.copper;
        
        // Outer ring (copper)
        ctx.fillStyle = colors.copper;
        ctx.beginPath();
        ctx.arc(this.x, this.y, pulseSize + 2, 0, 6.28);
        ctx.fill();

        // Solder blob
        ctx.fillStyle = this.charge > 0 ? colors.gold : colors.silver;
        ctx.beginPath();
        ctx.arc(this.x, this.y, pulseSize, 0, 6.28);
        ctx.fill();

        // Highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(this.x - 1, this.y - 1, pulseSize * 0.4, 0, 6.28);
        ctx.fill();
      }
    }

    // Current tracer along copper traces
    class Tracer {
      constructor(start, end, delay = 0) {
        this.start = start;
        this.end = end;
        this.progress = 0;
        this.speed = 0.006 + Math.random() * 0.01;
        this.delay = delay;
        this.active = delay === 0;
        this.color = Math.random() > 0.5 ? colors.gold : colors.orange;
      }

      update() {
        if (!this.active) {
          this.delay -= 16;
          if (this.delay <= 0) this.active = true;
          return;
        }

        this.progress += this.speed;
        if (this.progress >= 1) {
          this.progress = 0;
          this.end.charge = 1;
        }
      }

      draw(ctx) {
        if (!this.active) return;

        const x = this.start.x + (this.end.x - this.start.x) * this.progress;
        const y = this.start.y + (this.end.y - this.start.y) * this.progress;

        // Electric current pulse
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;
        
        for (let i = 0; i < 4; i++) {
          const trailProgress = Math.max(0, this.progress - i * 0.08);
          const tx = this.start.x + (this.end.x - this.start.x) * trailProgress;
          const ty = this.start.y + (this.end.y - this.start.y) * trailProgress;
          const opacity = 1 - i * 0.25;

          ctx.fillStyle = `rgba(243, 195, 45, ${opacity})`;
          ctx.beginPath();
          ctx.arc(tx, ty, 4 - i, 0, 6.28);
          ctx.fill();
        }
      }
    }

    // Electronic Components
    class Component {
      constructor(x, y, type, label, link) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.label = label;
        this.link = link;
        this.hovered = false;
        this.pulse = 0;
        this.rotation = Math.random() > 0.5 ? 0 : Math.PI / 2;
      }

      update(mouseX, mouseY) {
        this.pulse += 0.05;
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        this.hovered = Math.hypot(dx, dy) < 50;
      }

      draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        const glowIntensity = this.hovered ? 20 : 0;

        switch(this.type) {
          case 'resistor':
            this.drawResistor(ctx, glowIntensity);
            break;
          case 'capacitor':
            this.drawCapacitor(ctx, glowIntensity);
            break;
          case 'inductor':
            this.drawInductor(ctx, glowIntensity);
            break;
          case 'ic':
            this.drawIC(ctx, glowIntensity);
            break;
          case 'transistor':
            this.drawTransistor(ctx, glowIntensity);
            break;
          case 'diode':
            this.drawDiode(ctx, glowIntensity);
            break;
        }

        // Label
        ctx.rotate(-this.rotation);
        ctx.shadowBlur = glowIntensity;
        ctx.shadowColor = colors.gold;
        ctx.fillStyle = this.hovered ? colors.gold : colors.yellow;
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(this.label, 0, 35);

        // Value label
        ctx.font = '9px monospace';
        ctx.fillStyle = colors.copper;
        const values = ['10kΩ', '100µF', '1mH', 'ATmega', '2N2222', '1N4148'];
        ctx.fillText(values[Math.floor(Math.random() * values.length)], 0, 47);

        ctx.restore();
      }

      drawResistor(ctx, glow) {
        const w = 50, h = 18;
        
        // Leads
        ctx.strokeStyle = colors.silver;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-w/2 - 15, 0);
        ctx.lineTo(-w/2, 0);
        ctx.moveTo(w/2, 0);
        ctx.lineTo(w/2 + 15, 0);
        ctx.stroke();

        // Body
        ctx.shadowBlur = glow;
        ctx.shadowColor = colors.gold;
        ctx.fillStyle = colors.brown;
        ctx.fillRect(-w/2, -h/2, w, h);

        // Color bands (resistor code)
        const bands = [colors.orange, colors.orange, colors.brown, colors.gold];
        bands.forEach((color, i) => {
          ctx.fillStyle = color;
          ctx.fillRect(-w/2 + 8 + i * 10, -h/2, 6, h);
        });

        // End caps
        ctx.fillStyle = colors.silver;
        ctx.fillRect(-w/2 - 2, -h/2 - 1, 2, h + 2);
        ctx.fillRect(w/2, -h/2 - 1, 2, h + 2);
      }

      drawCapacitor(ctx, glow) {
        const w = 25, h = 35;
        
        // Leads
        ctx.strokeStyle = colors.silver;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-5, h/2 + 5);
        ctx.lineTo(-5, h/2 + 15);
        ctx.moveTo(5, h/2 + 5);
        ctx.lineTo(5, h/2 + 15);
        ctx.stroke();

        // Body (electrolytic)
        ctx.shadowBlur = glow;
        ctx.shadowColor = colors.gold;
        ctx.fillStyle = colors.blue;
        ctx.beginPath();
        ctx.ellipse(0, 0, w/2, h/2, 0, 0, 6.28);
        ctx.fill();

        // Stripe
        ctx.fillStyle = colors.black;
        ctx.fillRect(-w/2, -h/2, 8, h);

        // + marking
        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('+', w/2 - 5, 0);

        // Shine
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.ellipse(-w/4, -h/4, w/6, h/4, 0.3, 0, 6.28);
        ctx.fill();
      }

      drawInductor(ctx, glow) {
        // Coil/inductor
        ctx.shadowBlur = glow;
        ctx.shadowColor = colors.gold;
        ctx.strokeStyle = colors.copper;
        ctx.lineWidth = 4;
        
        // Coil loops
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.arc(-20 + i * 13, 0, 8, Math.PI, 0);
          ctx.stroke();
        }

        // Leads
        ctx.strokeStyle = colors.silver;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-28, 0);
        ctx.lineTo(-35, 0);
        ctx.moveTo(31, 0);
        ctx.lineTo(38, 0);
        ctx.stroke();

        // Ferrite core
        ctx.fillStyle = colors.black;
        ctx.fillRect(-22, -10, 44, 3);
      }

      drawIC(ctx, glow) {
        const w = 40, h = 50;
        
        // IC body
        ctx.shadowBlur = glow;
        ctx.shadowColor = colors.gold;
        ctx.fillStyle = colors.black;
        ctx.fillRect(-w/2, -h/2, w, h);

        // Notch
        ctx.fillStyle = colors.black;
        ctx.beginPath();
        ctx.arc(0, -h/2, 5, 0, Math.PI);
        ctx.fill();

        // Pins
        const pinCount = 8;
        ctx.fillStyle = colors.silver;
        for (let i = 0; i < pinCount / 2; i++) {
          const py = -h/2 + 10 + i * 12;
          // Left pins
          ctx.fillRect(-w/2 - 8, py - 2, 8, 3);
          // Right pins
          ctx.fillRect(w/2, py - 2, 8, 3);
        }

        // Label on IC
        ctx.fillStyle = 'white';
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('ATMEGA', 0, -5);
        ctx.fillText('328P', 0, 5);

        // Pin 1 dot
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(-w/2 + 6, -h/2 + 8, 2, 0, 6.28);
        ctx.fill();
      }

      drawTransistor(ctx, glow) {
        const r = 15;
        
        // Body (TO-92 package)
        ctx.shadowBlur = glow;
        ctx.shadowColor = colors.gold;
        ctx.fillStyle = colors.black;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI);
        ctx.lineTo(-r, 10);
        ctx.lineTo(r, 10);
        ctx.closePath();
        ctx.fill();

        // Flat side
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-r, 0);
        ctx.lineTo(r, 0);
        ctx.stroke();

        // Leads
        ctx.strokeStyle = colors.silver;
        ctx.lineWidth = 2;
        [-8, 0, 8].forEach(x => {
          ctx.beginPath();
          ctx.moveTo(x, 10);
          ctx.lineTo(x, 20);
          ctx.stroke();
        });

        // Label
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '7px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('2N2222', 0, 5);
      }

      drawDiode(ctx, glow) {
        const w = 40, h = 15;
        
        // Leads
        ctx.strokeStyle = colors.silver;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-w/2 - 10, 0);
        ctx.lineTo(-w/2, 0);
        ctx.moveTo(w/2, 0);
        ctx.lineTo(w/2 + 10, 0);
        ctx.stroke();

        // Body
        ctx.shadowBlur = glow;
        ctx.shadowColor = colors.gold;
        ctx.fillStyle = colors.orange;
        ctx.fillRect(-w/2, -h/2, w, h);

        // Cathode band
        ctx.fillStyle = colors.black;
        ctx.fillRect(w/2 - 6, -h/2, 6, h);

        // Glass shine
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(-w/2 + 5, -h/2 + 2, 15, 4);
      }
    }

    // Initialize
    const nodes = [];
    const tracers = [];
    const components = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const logoRadius = 150;

    // Create radial node network
    const layers = 4;
    const nodesPerLayer = 16;

    for (let layer = 1; layer <= layers; layer++) {
      const radius = logoRadius + layer * 120;
      const nodeCount = nodesPerLayer + layer * 4;

      for (let i = 0; i < nodeCount; i++) {
        const angle = (i / nodeCount) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        nodes.push(new Node(x, y));
      }
    }

    // Add electronic components for navigation
    const navItems = [
      { label: 'ABOUT', type: 'ic', angle: 0, link: '/about' },
      { label: 'TEAM', type: 'transistor', angle: Math.PI / 3, link: '/team' },
      { label: 'ROBOTS', type: 'capacitor', angle: Math.PI * 2 / 3, link: '/robots' },
      { label: 'GALLERY', type: 'inductor', angle: Math.PI, link: '/gallery' },
      { label: 'OUTREACH', type: 'resistor', angle: Math.PI * 4 / 3, link: '/outreach' },
      { label: 'SIGNUP', type: 'diode', angle: Math.PI * 5 / 3, link: '/signup' }
    ];

    navItems.forEach(item => {
      const dist = logoRadius + 280;
      const x = centerX + Math.cos(item.angle) * dist;
      const y = centerY + Math.sin(item.angle) * dist;
      components.push(new Component(x, y, item.type, item.label, item.link));
    });

    // Create connections
    nodes.forEach((node, i) => {
      nodes.forEach((other, j) => {
        if (i !== j) {
          const dist = Math.hypot(node.x - other.x, node.y - other.y);
          if (dist < 180 && Math.random() > 0.7) {
            node.connections.push(other);
          }
        }
      });

      if (node.connections.length > 0 && Math.random() > 0.6) {
        const target = node.connections[Math.floor(Math.random() * node.connections.length)];
        tracers.push(new Tracer(node, target, Math.random() * 2000));
      }
    });

    let beamNodes = [];

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePos({ x, y });

      beamNodes = nodes.filter(node => {
        const dist = Math.hypot(node.x - x, node.y - y);
        return dist < 100;
      });

      beamNodes.forEach(node => node.active = true);

      let hovering = null;
      components.forEach(comp => {
        if (comp.hovered) hovering = comp.label;
      });
      setHoveredComponent(hovering);
    };

    const handleClick = () => {
      components.forEach(comp => {
        if (comp.hovered) {
          console.log('Navigate to:', comp.link);
        }
      });
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('mouseenter', () => setBeamActive(true));
    canvas.addEventListener('mouseleave', () => setBeamActive(false));

    const animate = () => {
      // PCB green background
      ctx.fillStyle = colors.soldermask;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // PCB texture
      for (let i = 0; i < 100; i++) {
        ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.05})`;
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
      }

      // Draw copper traces (connections)
      nodes.forEach(node => {
        node.connections.forEach(target => {
          ctx.strokeStyle = colors.copperDark;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();

          // Copper highlight
          ctx.strokeStyle = colors.copper;
          ctx.lineWidth = 2;
          ctx.stroke();
        });
      });

      // Draw tracers (current flow)
      tracers.forEach(tracer => {
        tracer.update();
        tracer.draw(ctx);
      });

      // Draw nodes (solder pads)
      nodes.forEach(node => {
        node.update();
        node.active = false;
        node.draw(ctx);
      });

      // Mouse "soldering iron" beam
      if (beamActive) {
        const gradient = ctx.createRadialGradient(mousePos.x, mousePos.y, 0, mousePos.x, mousePos.y, 60);
        gradient.addColorStop(0, 'rgba(243, 195, 45, 0.4)');
        gradient.addColorStop(1, 'rgba(243, 195, 45, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(mousePos.x - 60, mousePos.y - 60, 120, 120);

        ctx.shadowBlur = 25;
        ctx.shadowColor = colors.gold;
        ctx.fillStyle = colors.gold;
        ctx.beginPath();
        ctx.arc(mousePos.x, mousePos.y, 6, 0, 6.28);
        ctx.fill();

        beamNodes.forEach(node => {
          ctx.strokeStyle = `rgba(243, 195, 45, 0.4)`;
          ctx.lineWidth = 3;
          ctx.shadowBlur = 15;
          ctx.shadowColor = colors.gold;
          ctx.beginPath();
          ctx.moveTo(mousePos.x, mousePos.y);
          ctx.lineTo(node.x, node.y);
          ctx.stroke();
        });
      }

      // Logo area
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.strokeStyle = colors.copper;
      ctx.lineWidth = 4;
      ctx.shadowBlur = 10;
      ctx.shadowColor = colors.gold;
      ctx.beginPath();
      ctx.arc(0, 0, logoRadius, 0, 6.28);
      ctx.stroke();

      ctx.font = 'bold 18px monospace';
      ctx.fillStyle = colors.yellow;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('[ LOGO AREA ]', 0, 0);
      ctx.font = '12px monospace';
      ctx.fillStyle = colors.copper;
      ctx.fillText('150px radius', 0, 20);
      ctx.restore();

      // Draw components
      components.forEach(comp => {
        comp.update(mousePos.x, mousePos.y);
        comp.draw(ctx);
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ backgroundColor: '#1a5f3a' }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-crosshair" />

      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4 border-2 border-yellow-600 font-mono text-yellow-400 text-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400">PCB v2.0 ACTIVE</span>
          </div>
          <div className="text-xs opacity-70">
            Position: ({mousePos.x.toFixed(0)}, {mousePos.y.toFixed(0)})
          </div>
          {hoveredComponent && (
            <div className="text-xs text-yellow-300 mt-1 font-bold">
              → {hoveredComponent}
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-6 left-6 right-6 z-10 pointer-events-none">
        <div className="max-w-4xl mx-auto bg-black/70 backdrop-blur-sm rounded-lg p-6 border-2 border-yellow-600">
          <h3 className="text-yellow-400 font-mono font-bold mb-3">🔧 RETRO PCB NAVIGATION</h3>
          <div className="grid md:grid-cols-6 gap-3 text-xs font-mono text-yellow-300">
            <div><span className="text-green-400">IC:</span> About</div>
            <div><span className="text-green-400">NPN:</span> Team</div>
            <div><span className="text-green-400">CAP:</span> Robots</div>
            <div><span className="text-green-400">IND:</span> Gallery</div>
            <div><span className="text-green-400">RES:</span> Outreach</div>
            <div><span className="text-green-400">DIO:</span> Signup</div>
          </div>
        </div>
      </div>

      <div className="absolute top-4 right-4 text-yellow-600 font-mono text-xs pointer-events-none">
        <div className="bg-black/70 p-3 rounded border border-yellow-600">
          <div>PCB-FTC-2024</div>
          <div>REV 1.0</div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedPCB;