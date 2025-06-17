import React, { useState, useEffect } from 'react';
import { useRoom } from '../context/RoomContext';
import { toast } from 'sonner';
import { Award, CheckCircle, XCircle, Plus, Minus, Send, Zap, ZapOff, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';

interface BuzzButtonProps {
  disabled?: boolean;
}

const BuzzButton: React.FC<BuzzButtonProps> = ({ disabled = false }) => {
  const { handleBuzz, winnerName, isHost, playerId, handleResetBuzz, awardPoints, subtractPlayerPoints, rejectAnswer, submitAnswer, roomData, canBuzz, isAudioPlaying } = useRoom();
  const [isBuzzing, setIsBuzzing] = useState(false);
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [keyPressed, setKeyPressed] = useState(false);

  // Reset hasSubmitted state when buzz is reset
  useEffect(() => {
    if (!roomData?.winnerInfo) {
      setHasSubmitted(false);
      setAnswer('');
    }
  }, [roomData?.winnerInfo]);

  // Verifichiamo se il giocatore corrente è il vincitore
  const isCurrentPlayerWinner = winnerName && playerId && roomData?.winnerInfo?.playerId === playerId;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && canBuzz && !keyPressed) {
        event.preventDefault();
        setKeyPressed(true);
        setIsPressed(true);
        handleBuzz();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        setKeyPressed(false);
        setIsPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleBuzz, canBuzz, keyPressed]);

  const onBuzz = async () => {
    if (disabled || isBuzzing) return;
    
    setIsBuzzing(true);
    try {
      await handleBuzz();
      // Sensazione tattile
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(200);
      }
    } catch (err) {
      console.error('Errore nel buzz:', err);
      toast.error('Errore nel registrare il buzz');
    } finally {
      setTimeout(() => {
        setIsBuzzing(false);
      }, 500);
    }
  };

  const onReset = async () => {
    await handleResetBuzz();
  };

  const handleAwardPoints = async (amount: number) => {
    if (winnerName) {
      await awardPoints(amount);
    }
  };

  const handleSubtractPoints = async (amount: number) => {
    if (winnerName) {
      await subtractPlayerPoints(amount);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      toast.error('Inserisci una risposta');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await submitAnswer(answer.trim());
      setAnswer('');
      setHasSubmitted(true);
      toast.success('Risposta inviata con successo');
    } catch (err) {
      console.error('Errore nell\'inviare la risposta:', err);
      toast.error('Errore nell\'inviare la risposta');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determina lo stato del pulsante
  const getButtonState = () => {
    if (winnerName) {
      return {
        text: `${winnerName} può rispondere`,
        variant: 'secondary' as const,
        disabled: true,
        icon: <Zap className="w-6 h-6" />,
        className: 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30'
      };
    }
    
    if (!isAudioPlaying) {
      return {
        text: 'In attesa del brano...',
        variant: 'outline' as const,
        disabled: true,
        icon: <VolumeX className="w-6 h-6 opacity-50" />,
        className: 'bg-gray-500/10 text-gray-500 border-gray-300 cursor-not-allowed'
      };
    }
    
    if (canBuzz) {
      return {
        text: 'BUZZ!',
        variant: 'default' as const,
        disabled: false,
        icon: <Zap className="w-6 h-6" />,
        className: `bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transform transition-all duration-200 ${
          isPressed ? 'scale-95 shadow-md' : 'hover:scale-105'
        } animate-pulse`
      };
    }
    
    return {
      text: 'BUZZ non disponibile',
      variant: 'outline' as const,
      disabled: true,
      icon: <ZapOff className="w-6 h-6 opacity-50" />,
      className: 'bg-gray-500/10 text-gray-500 border-gray-300'
    };
  };

  const buttonState = getButtonState();

  if (winnerName) {
    return (
      <div className="flex flex-col items-center justify-center animate-fade-in">
        <div className="text-center mb-6 space-y-2 p-6 rounded-xl bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/40 dark:to-indigo-900/30 shadow-lg border border-white/20">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-500/20 rounded-full">
              <Award className="w-10 h-10 text-indigo-500 dark:text-indigo-300" />
            </div>
          </div>
          <p className="text-lg text-indigo-600 dark:text-indigo-300">Il primo a premere è stato:</p>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-transparent bg-clip-text">{winnerName}</h2>

          {isCurrentPlayerWinner && !hasSubmitted && (
            <div className="mt-6 space-y-4 w-full max-w-md">
              <Textarea
                placeholder="Scrivi la tua risposta..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="min-h-[100px] bg-white/80 dark:bg-white/5"
                disabled={isSubmitting}
              />
              <Button
                onClick={handleSubmitAnswer}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                disabled={isSubmitting}
              >
                <Send className="mr-2 h-4 w-4" />
                Invia Risposta
              </Button>
            </div>
          )}

          {isCurrentPlayerWinner && hasSubmitted && (
            <div className="mt-4 p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <p className="text-emerald-700 dark:text-emerald-300">
                Hai già inviato la tua risposta
              </p>
            </div>
          )}
        </div>
        
        {isHost && (
          <div className="space-y-4 w-full max-w-md">
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => handleAwardPoints(10)}
                className="flex-1 py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-lg transition-all hover:shadow-emerald-500/20 hover:shadow-xl"
              >
                <CheckCircle className="mr-2 h-5 w-5" /> Risposta Corretta (+10 punti)
              </Button>
              
              <Button 
                onClick={() => handleSubtractPoints(5)}
                variant="destructive"
                className="flex-1 py-6 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-lg transition-all hover:shadow-rose-500/20 hover:shadow-xl"
              >
                <Minus className="mr-2 h-5 w-5" /> -5 Punti
              </Button>
            </div>

            <Button 
              onClick={() => handleAwardPoints(20)}
              className="w-full py-6 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold shadow-lg transition-all hover:shadow-violet-500/20 hover:shadow-xl"
            >
              <Plus className="mr-2 h-5 w-5" /> Risposta Eccellente (+20 punti)
            </Button>
            
            <Button
              onClick={onReset}
              variant="outline"
              className="w-full py-5 mt-2 border-2 border-indigo-300 dark:border-indigo-700 bg-white dark:bg-transparent text-indigo-700 dark:text-indigo-300 font-semibold shadow-md hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-300"
            >
              Resetta Buzz
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Indicatore stato audio */}
      <div className="flex items-center gap-2">
        <Badge 
          variant={isAudioPlaying ? "default" : "secondary"}
          className={`flex items-center gap-1 ${
            isAudioPlaying 
              ? 'bg-green-500/20 text-green-600 border-green-500/30 animate-pulse' 
              : 'bg-gray-500/20 text-gray-500 border-gray-300'
          }`}
        >
          {isAudioPlaying ? (
            <>
              <Volume2 className="w-3 h-3" />
              Audio in riproduzione
            </>
          ) : (
            <>
              <VolumeX className="w-3 h-3" />
              Audio in pausa
            </>
          )}
        </Badge>
      </div>

      {/* Pulsante Buzz principale */}
      <Button
        onClick={onBuzz}
        disabled={buttonState.disabled}
        variant={buttonState.variant}
        size="lg"
        className={`w-32 h-32 rounded-full text-2xl font-bold ${buttonState.className} relative overflow-hidden`}
      >
        <div className="flex flex-col items-center gap-2">
          {buttonState.icon}
          <span className="text-sm font-semibold">
            {buttonState.text}
          </span>
        </div>
        
        {/* Effetto di ripple quando disponibile */}
        {canBuzz && (
          <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping" />
        )}
      </Button>

      {/* Istruzioni */}
      <div className="text-center space-y-1">
        {canBuzz ? (
          <>
            <p className="text-sm font-medium text-green-600">
              🎵 Premi SPAZIO o clicca per buzzare!
            </p>
            <p className="text-xs text-muted-foreground">
              Il buzz è attivo durante la riproduzione
            </p>
          </>
        ) : !isAudioPlaying ? (
          <>
            <p className="text-sm text-gray-500">
              ⏸️ Aspetta che inizi il brano
            </p>
            <p className="text-xs text-muted-foreground">
              Il buzz si attiverà automaticamente
            </p>
          </>
        ) : winnerName ? (
          <p className="text-sm text-yellow-600">
            🏆 Qualcuno ha già buzzato!
          </p>
        ) : (
          <p className="text-sm text-gray-500">
            Buzz non disponibile
          </p>
        )}
      </div>

      {/* Indicatore per l'host */}
      {isHost && (
        <Badge variant="outline" className="text-xs">
          👑 Host - Controlla l'audio per abilitare il buzz
        </Badge>
      )}
    </div>
  );
};

export default BuzzButton;
