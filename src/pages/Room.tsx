import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoom } from '../context/RoomContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BuzzButton from '../components/BuzzButton';
import PlayerList from '../components/PlayerList';
import RoomInfo from '../components/RoomInfo';
import AudioPlayer from '../components/AudioPlayer';
import { MessageCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Room = () => {
  const { code } = useParams<{ code: string }>();
  const { roomCode, setRoomCode, roomData, playerName, isHost, error, isLoading } = useRoom();
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/50 dark:via-purple-950/30 dark:to-pink-950/20">
      <Header />
      
      <main className="flex-1 flex flex-col p-6">
        {isHost ? (
          // Layout per l'host
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Colonna sinistra: Controlli della stanza e lista giocatori */}
            <div className="lg:w-1/3 space-y-6 lg:sticky lg:top-6 self-start">
              <RoomInfo />
              <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
                <div className="flex flex-col items-center mb-6">
                  <WinnerAnswer />
                  <div className="w-full max-w-md">
                    <BuzzButton />
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-4">Giocatori in stanza</h2>
                <PlayerList />
              </div>
            </div>

            {/* Colonna destra: Player audio e controlli del gioco */}
            <div className="lg:w-2/3 space-y-6">
              <AudioPlayer />
            </div>
          </div>
        ) : (
          // Layout per i giocatori
          <div className="w-full max-w-4xl mx-auto space-y-8">
            <RoomInfo />
            <div className="flex flex-col items-center">
              <WinnerAnswer />
              <BuzzButton />
            </div>
            <PlayerList />
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Room;
