import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoom } from '../context/RoomContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BuzzButton from '../components/BuzzButton';
import PlayerList from '../components/PlayerList';
import RoomInfo from '../components/RoomInfo';
import AudioPlayer from '../components/AudioPlayer';
import GameModeSelector from '../components/GameModeSelector';
import GameTimer from '../components/GameTimer';
import GameModeDisplay from '../components/GameModeDisplay';
import { MessageCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Leaderboard } from '../components/Leaderboard';
import { PlayerStats } from '../components/PlayerStats';

const Room = () => {
  const { code } = useParams<{ code: string }>();
  const { roomCode, setRoomCode, roomData, playerName, isHost, error, isLoading, winnerName } = useRoom();
  const navigate = useNavigate();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (code && code !== roomCode) {
      setRoomCode(code);
    }
  }, [code, roomCode, setRoomCode]);

  useEffect(() => {
    if (!playerName) {
      toast.error('Devi inserire un nome per entrare in una stanza');
      navigate('/');
      return;
    }
    
    if (error) {
      toast.error(error);
      navigate('/');
      return;
    }
    
    const timeout = setTimeout(() => {
      if (!roomData && !isLoading) {
        toast.error('La stanza non esiste o è scaduta');
        navigate('/');
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [playerName, roomData, error, navigate, isLoading]);

  useEffect(() => {
    if (roomCode && !roomData && !isLoading) {
      console.log("Room data is null, room may have been deleted due to inactivity");
      toast.error('La stanza è stata chiusa per inattività');
      navigate('/');
    }
  }, [roomData, roomCode, navigate, isLoading]);

  useEffect(() => {
    if (roomData) {
      setIsInitializing(false);
    }
  }, [roomData]);

  if (isInitializing || isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/50">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Caricamento stanza...</p>
      </div>
    );
  }

  const WinnerAnswer = () => {
    if (!roomData?.winnerInfo?.answer) return null;

    return (
      <div className="w-full max-w-2xl mx-auto mb-8 p-6 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-700/30 shadow-lg animate-fade-in">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
            <MessageCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-300" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-indigo-600 dark:text-indigo-300 mb-1">
              Risposta di {roomData.winnerInfo.playerName}:
            </p>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              "{roomData.winnerInfo.answer}"
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-white" />
              <p className="text-white">Caricamento stanza...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-6 max-w-md mx-auto">
              <h2 className="text-xl font-bold text-red-400 mb-2">Errore</h2>
              <p className="text-red-300 mb-4">{error}</p>
              <button
                onClick={() => navigate('/')}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Torna alla Home
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <RoomInfo />
            
            {/* Game Mode Display - Visibile a tutti quando una modalità è attiva */}
            <GameModeDisplay />
            
            {/* Game Timer - Visibile a tutti quando attivo */}
            <GameTimer />
            
            {/* Game Mode Selector - Solo per l'host */}
            {isHost && (
              <div className="mb-6">
                <GameModeSelector />
              </div>
            )}
            
            {isHost && <AudioPlayer />}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-6">
                <BuzzButton />
                {winnerName && (
                  <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-center">
                    <MessageCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
                    <p className="text-green-300">
                      <span className="font-bold">{winnerName}</span> può rispondere!
                    </p>
                  </div>
                )}
                
                {/* Statistiche personali del giocatore */}
                <PlayerStats compact={true} />
              </div>
              
              <PlayerList />
              
              {/* Classifica dei punteggi */}
              <div className="space-y-6">
                <Leaderboard />
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Room;
