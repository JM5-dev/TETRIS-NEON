# 🎮 TETRIS NEON

> Un moderno Tetris con stile neon-retro, effetti visivi accattivanti e controlli flessibili.

![Tetris Neon](https://img.shields.io/badge/Game-Tetris%20Neon-ff00ff?style=for-the-badge&logo=gamepad)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## ⚡ Guida Veloce

| Azione | Tasti |
|--------|-------|
| **Muovere** | `← →` o `A D` |
| **Ruotare** | `↑` o `W` |
| **Accelerare** | `↓` o `S` |
| **Hard Drop** | `INVIO` |
| **Pausa** | `P` |
| **Audio** | `M` |

---

## ✨ Caratteristiche Principali

🎯 **Gameplay Classico**  
7 tetramini originali, rotazione wall-kick, ghost piece, hard drop

🌈 **Tema Neon**  
Colori brillanti, effetti glow 3D, design arcade retro-futuristico

📊 **Sistema Punteggio**  
100-800 punti per righe, moltiplicatori di livello, record salvato automaticamente

🎮 **Controlli Flessibili**  
Tastiera (frecce/WASD), Gamepad, supporto touch su mobile

🎵 **Audio & Effetti**  
Musica di sottofondo, effetti sonori, scanline CRT retro

📱 **Responsive Design**  
Ottimizzato per desktop, tablet e mobile



---

## 🚀 Iniziare

### 📋 Requisiti
- Browser moderno (Chrome, Firefox, Edge, Safari)
- JavaScript abilitato

### ⚙️ Installazione

**Opzione 1: Apertura diretta**
```bash
Apri index.html nel browser
```

**Opzione 2: Server locale** (consigliato)
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server

# PHP
php -S localhost:8000
```
Visita `http://localhost:8000`

---

## 📁 Struttura

```
tetris-neon/
├── index.html          # File principale
├── README.md           # Documentazione
└── assets/
    ├── css/style.css   # Stili neon
    ├── js/script.js    # Logica di gioco
    ├── audio/          # Musica e suoni
    └── img/            # Immagini
```

---

## 🎨 Personalizzazione

**Colori neon** in `style.css`:
```css
:root {
    --neon-cyan: #00ffff;
    --neon-magenta: #ff00ff;
    --neon-yellow: #ffff00;
    /* ... */
}
```

**Velocità** in `script.js`:
```javascript
let gameSpeed = 1000; // Millisecondi
```

---

## 🎯 Tips & Tricks

💡 Usa la **ghost piece** per predire dove atterrerà il pezzo  
💡 **Hard Drop** per cadute istantanee e bonus punti  
💡 Completa **4 righe** contemporaneamente per il massimo punteggio (Tetris!)  
💡 Aumenta il **livello** ogni 10 righe completate  

---

## 🐛 Troubleshooting

**Audio non funziona?**  
→ Verifica che `tetris-theme.mp3` e `game-over.mp3` siano in `assets/audio/`  
→ Interagisci con la pagina prima (alcuni browser bloccano l'autoplay)  
→ Premi `M` per attivare/disattivare audio  

**Layout strano su mobile?**  
→ Usa il responsive design del browser  
→ Ruota il dispositivo in orizzontale per migliore visibilità  

---

**Divertiti a giocare! 🎮✨**
