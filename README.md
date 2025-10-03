# 🎮 TETRIS NEON

Un moderno gioco di Tetris con stile neon-retro e effetti visivi accattivanti.

![Tetris Neon](https://img.shields.io/badge/Game-Tetris%20Neon-ff00ff?style=for-the-badge&logo=gamepad)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

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
- Animazioni lampeggianti per il titolo
- Sfondo pixellato animato con colori che cambiano dinamicamente

### 🎮 **Controlli Flessibili**
- **Frecce direzionali**: ← → ↓ ↑ (movimento e rotazione)
- **WASD**: A D S W (controlli alternativi)
- **Invio**: Hard drop
- **P**: Pausa/Riprendi
- **M**: Toggle audio
- **Supporto gamepad** per controller di gioco

### 🎵 **Audio e Effetti**
- Musica di sottofondo in loop
- Effetti sonori per ogni azione
- Controllo volume integrato
- Possibilità di silenziare

### 📊 **Sistema di Punteggio**
- **100 punti** per 1 riga eliminata
- **300 punti** per 2 righe (Double)
- **500 punti** per 3 righe (Triple)
- **800 punti** per 4 righe (Tetris)
- Moltiplicatori di livello
- Punti extra per hard drop
- Salvataggio automatico del record personale

### 🎨 **Effetti Visivi Avanzati**
- Pixel colorati dinamici che cambiano colore in tempo reale
- Pattern pixellati animati su più layer
- Effetti di dissolvimento al game over
- Animazioni fluide per tutte le interazioni
- Game over con scritta neon magenta brillante

### 📱 **Design Responsivo**
- Layout adattivo per desktop, tablet e mobile
- Centraggio perfetto dell'area di gioco
- Interfaccia ottimizzata per diverse risoluzioni
- Media queries per schermi piccoli

## 🚀 Come Giocare

### 🎯 **Obiettivo**
Disponi i tetramini che cadono per completare righe orizzontali. Le righe complete vengono eliminate e ottieni punti. Il gioco termina quando i pezzi raggiungono la cima.

### 🎮 **Controlli**
```
← →     Muovi a sinistra/destra
↓       Accelera la caduta
↑       Ruota il pezzo
Invio   Drop istantaneo
P       Pausa
M       Silenzioso/Audio
```

### 📈 **Progressione**
- Ogni 10 righe completate il livello aumenta
- La velocità di caduta aumenta con il livello
- Il punteggio è moltiplicato per il livello corrente

## 🛠️ Installazione

1. **Clone il repository**
   ```bash
   git clone https://github.com/username/tetris-neon.git
   cd tetris-neon
   ```

2. **Apri il gioco**
   - Apri il file `index.html` nel tuo browser preferito
   - Oppure usa un server locale per sviluppo

3. **Inizia a giocare!**
   - Clicca su "INIZIA" per cominciare
   - Usa i controlli per giocare

## 📁 Struttura del Progetto

```
tetris-neon/
├── index.html              # File HTML principale
├── README.md               # Documentazione
├── assests/
│   ├── css/
│   │   └── style.css       # Stili CSS con tema neon
│   ├── js/
│   │   └── script.js       # Logica di gioco JavaScript
│   └── audio/              # File audio (opzionali)
│       ├── tetris-theme.mp3
│       ├── line-clear.mp3
│       ├── move.mp3
│       ├── rotate.mp3
│       ├── drop.mp3
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
Aggiungi i file audio nella cartella `assests/audio/` per abilitare i suoni.

## 🏆 Funzionalità Avanzate

- **Salvataggio automatico** del punteggio record
- **Pixel dinamici** sullo sfondo che cambiano colore
- **Effetti particellari** per il game over
- **Animazioni CSS** fluide e ottimizzate
- **Supporto touch** per dispositivi mobili

## 🐛 Risoluzione Problemi

### 🎵 **Audio non funziona**
- Assicurati che i file audio siano nella cartella corretta
- Alcuni browser bloccano l'autoplay, interagisci prima con la pagina

### 📱 **Layout su mobile**
- Il gioco si adatta automaticamente agli schermi piccoli
- Su dispositivi molto piccoli, ruota in modalità landscape

### 🖥️ **Performance**
- Il gioco è ottimizzato per browser moderni
- Disabilita gli effetti pixel se hai problemi di performance

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

**Jacopo** - *Sviluppatore Iniziale*

## 🙏 Ringraziamenti

- Ispirato dal classico gioco Tetris
- Design neon ispirato all'estetica arcade degli anni '80
- Effetti CSS moderni per un look retro-futuristico

---

⭐ **Se ti piace questo progetto, lascia una stella!** ⭐

🎮 **Buon divertimento con Tetris Neon!** 🎮