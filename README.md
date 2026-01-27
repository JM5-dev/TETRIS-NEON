# 🎮 TETRIS NEON

Un moderno gioco di Tetris con stile neon-retro e effetti visivi accattivanti. Vivi l'esperienza arcade degli anni '80 con la tecnologia del 2026!

![Tetris Neon](https://img.shields.io/badge/Game-Tetris%20Neon-ff00ff?style=for-the-badge&logo=gamepad)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-green?style=for-the-badge)

## ✨ Caratteristiche

### 🎯 **Gameplay Classico**
- Tutti i 7 tetramini originali (I, O, T, S, Z, J, L)
- Sistema di rotazione con wall-kick
- Ghost piece (anteprima trasparente)
- Hard drop per caduta istantanea
- Eliminazione simultanea di righe multiple
- Sistema di livelli progressivi con aumento di velocità

### 🌈 **Tema Neon-Retro**
- Design con colori neon brillanti (ciano, magenta, giallo, verde, rosso, blu, arancione)
- Effetti glow e ombreggiature sui blocchi 3D
- Blocchi con sfaccettature e illuminazione realistica
- Titolo "TETRIS NEON" con effetto neon brillante
- Sfondo personalizzato con immagine arcade

### 🎮 **Controlli Flessibili**
- **Frecce direzionali**: ← → ↓ ↑ (movimento e rotazione)
- **WASD**: A D S W (controlli alternativi)
- **Invio**: Hard drop
- **P**: Pausa/Riprendi
- **M**: Toggle audio
- **Supporto gamepad** per controller di gioco

### 🎵 **Audio e Effetti**
- Musica di sottofondo in loop (attivabile/disattivabile con M)
- Effetto sonoro per game over
- Controllo volume integrato
- Design audio minimalista per non disturbare il gameplay

### 📊 **Sistema di Punteggio**
- **100 punti** per 1 riga eliminata
- **300 punti** per 2 righe (Double)
- **500 punti** per 3 righe (Triple)
- **800 punti** per 4 righe (Tetris)
- Moltiplicatori di livello
- Punti extra per hard drop
- Salvataggio automatico del record personale

### 🎨 **Effetti Visivi Avanzati**
- Effetto scanline per aspetto retro-CRT
- Effetti di dissolvimento al game over
- Animazioni fluide per tutte le interazioni
- Game over con scritta neon brillante
- Sfondo personalizzato con immagine

### 📱 **Design Responsivo**
- Layout adattivo per desktop, tablet e mobile
- Centraggio perfetto dell'area di gioco
- Interfaccia ottimizzata per diverse risoluzioni
- Media queries per schermi piccoli

## 🚀 Come Giocare

### 🎯 **Obiettivo**
Disponi i tetramini che cadono per completare righe orizzontali. Le righe complete vengono eliminate e ottieni punti. Il gioco termina quando i pezzi raggiungono la cima.

### 🎮 **Controlli**

#### ⌨️ Tastiera
| Tasto | Azione |
|-------|--------|
| ← / A | Muovi a sinistra |
| → / D | Muovi a destra |
| ↓ / S | Accelera la caduta |
| ↑ / W | Ruota il pezzo |
| Invio | Hard drop (caduta istantanea) |
| P | Pausa/Riprendi |
| M | Attiva/Disattiva audio |

#### 🎮 Gamepad
- Supporto completo per controller di gioco
- Mappatura automatica dei pulsanti

### 📈 **Progressione**
- Ogni 10 righe completate il livello aumenta
- La velocità di caduta aumenta con il livello
- Il punteggio è moltiplicato per il livello corrente

## 🛠️ Installazione

### 📋 **Requisiti**
- Browser moderno (Chrome, Firefox, Edge, Safari)
- JavaScript abilitato
- Supporto HTML5 Canvas
- (Opzionale) File audio per effetti sonori

### 💻 **Setup**

1. **Clone il repository**
   ```bash
   git clone https://github.com/username/tetris-neon.git
   cd tetris-neon
   ```

2. **Apri il gioco**
   - **Metodo semplice**: Apri il file `index.html` direttamente nel browser
   - **Metodo consigliato**: Usa un server locale per sviluppo
     ```bash
     # Con Python 3
     python -m http.server 8000
     
     # Con Node.js (http-server)
     npx http-server
     
     # Con PHP
     php -S localhost:8000
     ```
   - Visita `http://localhost:8000` nel browser

3. **Inizia a giocare!**
   - Clicca su "INIZIA" per cominciare una nuova partita
   - Usa i controlli per giocare
   - Premi P per mettere in pausa

## 📁 Struttura del Progetto

```
tetris-neon/
├── index.html              # File HTML principale
├── README.md               # Documentazione
├── assets/
│   ├── css/
│   │   └── style.css       # Stili CSS con tema neon
│   ├── js/
│   │   └── script.js       # Logica di gioco JavaScript
│   ├── img/
│   │   └── sfondo.jpg      # Immagine di sfondo
│   ├── video/              # Cartella per video (opzionale)
│   └── audio/              # File audio (opzionali)
│       ├── tetris-theme.mp3
│       └── game-over.mp3
```

## 🎨 Personalizzazione

### 🌈 **Colori Neon**
I colori possono essere personalizzati modificando le variabili CSS in `style.css`:

```css
:root {
    --neon-cyan: #00ffff;
    --neon-green: #39ff14;
    --neon-magenta: #ff00ff;
    --neon-yellow: #ffff00;
    --neon-blue: #00f3ff;
    --neon-red: #ff073a;
    --neon-orange: #ff9e00;
}
```

### ⚙️ **Velocità di Gioco**
Modifica la velocità iniziale in `script.js`:

```javascript
let gameSpeed = 1000; // Millisecondi tra le mosse
```

### 🎵 **Audio**
Aggiungi i file audio nella cartella `assets/audio/` per abilitare i suoni.

## 🏆 Funzionalità Avanzate:
- `tetris-theme.mp3` - Musica di sottofondo
- `game-over.mp3` - Suono di game over
Effetti scanline** per simulare un monitor CRT retrò
- **✨ Effetti particellari** per il game over con animazioni fluide
- **🌊 Animazioni CSS** ottimizzate per performance elevate
- **📱 Supporto touch** per dispositivi mobili e tablet
- **🕹️ Supporto gamepad** per un'esperienza arcade completa
- **⚡ Sistema di livelli dinamico** con velocità progressiva
- **👻 Ghost piece** per preview della posizione di atterraggio
- **🖼️ Sfondo personalizzato** con immagine tematica arcade
- **📱 Supporto touch** per dispositivi mobili e tablet
- **🕹️ Supporto gamepad** per un'esperienza arcade completa
- **⚡ Sistema di livelli dinamico** con velocità progressiva
- **👻 Ghost piece** per preview della posizione di atterraggio

## 🐛 Risoluzione Problemi

### 🎵 **Audio non funziona**
- File richiesti: `tetris-theme.mp3` e `game-over.mp3`
- Verifica il formato dei file (supportati: MP3, OGG, WAV)
- Alcuni browser bloccano l'autoplay: interagisci con la pagina prima
- Controlla le impostazioni audio del browser
- Premipostazioni audio del browser
- Prova a premere M per attivare/disattivare l'audio

### 📱 **Layout su mobile**
- Il gioco si adatta automaticamente agli schermi piccoli
- Su dispositivi molto piccoli (<480px), ruota in modalità landscape
- Per i controlli touch, tocca le aree ai lati del gioco

### 🖥️ **Performance**
- Il gioco è ottimizzato per browser moderni (Chrome 90+, Firefox 88+, Safari 14+)
- Richiede supporto per Canvas 2D e Web Audio API
- Su dispositivi datati, considera di ridurre gli effetti visivi nel codice
- Chiudi altre schede del browser per migliorare le prestazioni

### 🚫 **Il gioco non parte**
- Verifica che JavaScript sia abilitato nel browser
- Controlla la console del browser per eventuali errori (F12)
- Assicurati che tutti i file (HTML, CSS, JS) siano presenti
- Prova a pulire la cache del browser (Ctrl+F5)

## 📄 Licenza

Questo progetto è distribuito sotto licenza MIT. Vedi il file `LICENSE` per maggiori dettagli.

## 🤝 Contributi

I contributi sono benvenuti! Sentiti libero di:

1. Fare un fork del progetto
2. Creare un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Committare le modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Pushare al branch (`git push origin feature/AmazingFeature`)
5. Aprire una Pull Request

## 👨‍💻 Autore

**Jacopo** - *Sviluppatore Principale* - [GitHub](https://github.com/username)

## 🌟 Roadmap Futura

- [ ] Modalità multiplayer locale
- [ ] Leaderboard online
- [ ] Temi personalizzabili
- [ ] Modalità sfida con obiettivi
- [ ] Statistiche dettagliate di gioco
- [ ] Power-up speciali
- [ ] Modalità maratona e sprint

## 🙏 Ringraziamenti

- Ispirato dal classico gioco Tetris
- Design neon ispirato all'estetica arcade degli anni '80
- Effetti CSS moderni per un look retro-futuristico

---

⭐ **Se ti piace questo progetto, lascia una stella!** ⭐

🎮 **Buon divertimento con Tetris Neon!** 🎮