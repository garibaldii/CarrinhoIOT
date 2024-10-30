import SerialPort from 'serialport';
import { connect, Schema, model } from 'mongoose';
import 'dotenv/config' 

// Configuração do MongoDB
connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
 
const comandoSchema = new Schema({
  comando: String,
  data_hora: { type: Date, default: Date.now },
});
 
const Comando = model('Comando', comandoSchema);
 
// Configuração da porta serial (ajuste conforme necessário)
const port = new SerialPort('COM3', { baudRate: 9600 }); 

// Lê dados da serial
port.on('data', (data) => {
  const comando = data.toString().trim();
  console.log(`Comando recebido: ${comando}`);
 
  // Armazena o comando no MongoDB
  const novoComando = new Comando({ comando });
  novoComando.save()
    .then(() => console.log('Comando armazenado no MongoDB'))
    .catch((err) => console.error('Erro ao salvar no MongoDB:', err));
});
 
port.on('error', (err) => {
  console.error('Erro na porta serial:', err);
});