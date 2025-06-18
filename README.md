# 🎵 BuzzV1.3 - Indovina la Canzone

Un'app web multiplayer interattiva per giocare a "Indovina la Canzone" con amici e familiari! Perfetta per feste, eventi e divertimento di gruppo.

## ✨ Caratteristiche Principali

### 🎮 **Gameplay Multiplayer**
- **Stanze private** con codici unici
- **Fino a 30+ giocatori** contemporaneamente
- **Sistema Buzz** interattivo per rispondere
- **Punteggio in tempo reale**
- **QR Code** per condivisione facile

### 🎵 **Audio Player Avanzato**
- **Dual-channel player** (Sinistro/Destro)
- **Streaming audio WebRTC** per tutti i giocatori
- **Controlli volume** e seek bar
- **Modalità loop** per ogni canale
- **Reset completo** per problemi con molti utenti
- **Ricerca brani** integrata

### 🎨 **Interfaccia Moderna**
- **Design responsive** per desktop e mobile
- **UI elegante** con glassmorphism
- **Animazioni fluide** e feedback visivo
- **Toast notifications** per feedback immediato
- **Tema scuro** ottimizzato

## 🚀 Installazione e Avvio

### Prerequisiti
- Node.js 18+ 
- npm o yarn
- Account Firebase (per database)

### 1. Clona il Repository
```bash
git clone https://github.com/Galandar80/BuzzV1.3.git
cd BuzzV1.3
```

### 2. Installa le Dipendenze
```bash
npm install
```

### 3. Configurazione Firebase
1. Crea un progetto su [Firebase Console](https://console.firebase.google.com/)
2. Abilita **Realtime Database**
3. Copia la configurazione Firebase
4. Sostituisci la configurazione in `src/services/firebase.ts`

### 4. Avvia l'App
```bash
# Sviluppo
npm run dev

# Build di produzione
npm run build

# Preview build
npm run preview
```

L'app sarà disponibile su `http://localhost:5173`

## 🎯 Come Giocare

### Per l'Host (Creatore Stanza):
1. **Crea una stanza** con il tuo nome
2. **Condividi il codice** o QR code con i giocatori
3. **Carica i file audio** nei player Sinistro/Destro
4. **Riproduci la musica** e gestisci il gioco
5. **Assegna punti** ai giocatori che rispondono correttamente

### Per i Giocatori:
1. **Unisciti alla stanza** con il codice
2. **Ascolta la musica** in streaming
3. **Premi BUZZ** quando conosci la risposta
4. **Scrivi la tua risposta** quando sei il primo
5. **Accumula punti** per scalare la classifica!

## 🛠️ Tecnologie Utilizzate

- **React 18** + **TypeScript**
- **Vite** per build veloce
- **Firebase Realtime Database** per multiplayer
- **WebRTC** per streaming audio
- **Tailwind CSS** per styling
- **Radix UI** per componenti
- **Lucide React** per icone
- **Sonner** per toast notifications

## 📱 Funzionalità Avanzate

### 🔄 Reset Player Audio
Funzionalità esclusiva per l'host per risolvere problemi audio:
- Resetta completamente lo stato del player
- Riavvia le connessioni WebRTC
- Pulisce la memoria da file corrotti
- Ripristina tutti i controlli

### 🎵 Gestione Audio Intelligente
- **Fade in/out** automatico
- **Prevenzione sovrapposizioni** audio
- **Gestione memoria** ottimizzata
- **Compatibilità multi-browser**

### 📊 Sistema Punteggio
- **Punti personalizzabili** (default: +10 corretta, -5 sbagliata)
- **Classifica in tempo reale**
- **Storico risposte** per ogni giocatore
- **Reset punteggi** per nuove partite

## 🔧 Comandi Disponibili

```bash
# Sviluppo con hot reload
npm run dev

# Build di produzione
npm run build

# Build di sviluppo
npm run build:dev

# Controllo qualità codice
npm run lint

# Preview build locale
npm run preview
```

## 🌟 Caratteristiche Tecniche

- **PWA Ready** - Installabile come app
- **Responsive Design** - Funziona su tutti i dispositivi
- **Real-time Sync** - Aggiornamenti istantanei
- **Offline Resilience** - Gestione disconnessioni
- **Performance Optimized** - Caricamento veloce

## 🤝 Contribuire

1. Fork il progetto
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Commit le modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è sotto licenza MIT. Vedi il file `LICENSE` per dettagli.

## 🎊 Divertiti!

Perfetto per:
- 🎉 Feste e compleanni
- 👨‍👩‍👧‍👦 Serate in famiglia
- 🏢 Team building aziendali
- 🎓 Eventi scolastici
- 🍻 Serate con amici

---

**Sviluppato con ❤️ per il divertimento di tutti!**

Per supporto o domande, apri una [Issue](https://github.com/Galandar80/BuzzV1.3/issues) su GitHub.
"# BuzzV1.5" 
