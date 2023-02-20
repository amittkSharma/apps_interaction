using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.WebSockets;
using System.Runtime.CompilerServices;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace app_client
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window, INotifyPropertyChanged
    {
        ClientWebSocket socket = new ClientWebSocket();

        public bool IsConnectedToServer
        {
            get { return _IsConnectedToServer; }
            set
            {
                _IsConnectedToServer = value;
                OnPropertyChanged();
            }
        }
        private bool _IsConnectedToServer = false;


        public string MessageToSend
        {
            get { return _messageToSend; }
            set
            {
                _messageToSend = value;
                OnPropertyChanged();
            }
        }
        private string _messageToSend = "";

        public string MessageReceived
        {
            get { return _messageReceived; }
            set
            {
                _messageReceived = value;
                OnPropertyChanged();
            }
        }
        private string _messageReceived = "";

        public string ProcessId
        {
            get { return _processId; }
            set
            {
                _processId = value;
                OnPropertyChanged();
            }
        }
        private string _processId = "";

        public MainWindow()
        {
            InitializeComponent();
            // Getting the application process id
            GetProcessId();
        }

        private void GetProcessId()
        {
            int processId = Process.GetCurrentProcess().Id;
            ProcessId = processId.ToString();
        }

        private async void ConnectToServerAsync()
        {
            try
            {
                socket.ConnectAsync(new Uri("ws://localhost:8081"), CancellationToken.None).Wait();
                if (socket.State == WebSocketState.Open)
                {
                    IsConnectedToServer = true;
                    SendMessage message = new SendMessage { receivedFrom = ProcessId, message = MessageToSend,sendTo = "dashboard", messageType = "connection" };
                    sendMessage(message);
                    await Receive(socket, CancellationToken.None);
                }
            }
            catch (Exception ex)
            {
                if (IsConnectedToServer == true)
                {
                    NotifyUser("Already connected to the server", "Alert");
                }
                else
                {
                    NotifyUser($"Failed to connect to the server due to: {ex.Message}", "Error");
                }

            }
        }


        private void Button_Click(object sender, RoutedEventArgs e)
        {
             ConnectToServerAsync();
        }


        private void OnSendMessageClick(object sender, RoutedEventArgs e)
        {
            SendMessage message = new SendMessage { receivedFrom = ProcessId, message = MessageToSend, sendTo = "dashboard", messageType = "message" };
            sendMessage(message);

        }

        private async Task Receive(ClientWebSocket socket, CancellationToken stoppingToken)
        {
            var buffer = new ArraySegment<byte>(new byte[2048]);
            while (!stoppingToken.IsCancellationRequested)
            {
                WebSocketReceiveResult result;
                using (var ms = new MemoryStream())
                {
                    do
                    {
                        result = await socket.ReceiveAsync(buffer, stoppingToken);
                        ms.Write(buffer.Array, buffer.Offset, result.Count);
                    } while (!result.EndOfMessage);

                    if (result.MessageType == WebSocketMessageType.Close)
                        break;

                    ms.Seek(0, SeekOrigin.Begin);
                    string streamResult;
                    using (var reader = new StreamReader(ms, Encoding.UTF8))
                    {
                        streamResult = await reader.ReadToEndAsync();
                    }

                    SendMessage msg = JsonConvert.DeserializeObject<SendMessage>(streamResult);
                    if (msg.receivedFrom == "dashboard" && ProcessId == msg.sendTo)
                    {
                        MessageReceived = msg.message;
                    }

                }
            };
        }

        private void sendMessage(SendMessage message)
        {
            if (socket.State == WebSocketState.Open)
            {
                string data = JsonConvert.SerializeObject(message);
                byte[] encoded = Encoding.UTF8.GetBytes(data);
                ArraySegment<byte> buffer = new ArraySegment<Byte>(encoded, 0, encoded.Length);

                socket.SendAsync(buffer, WebSocketMessageType.Text, true, CancellationToken.None).Wait();
                NotifyUser("Message is successfully transmitted to the server", "Success");
            }
            else
            {
                Console.Error.WriteLine("Server is not connected, please connect again");
            }
        }

        private void NotifyUser(string notificationMsg, string caption)
        {
            MessageBox.Show(notificationMsg, caption, MessageBoxButton.OK);
        }

        public event PropertyChangedEventHandler PropertyChanged;

        /// <summary>
        /// Raises this object's PropertyChanged event.
        /// </summary>
        /// <param name="propertyName">The property that has a new value.</param>
        protected void OnPropertyChanged([CallerMemberName]string propertyName = null)
        {
            PropertyChangedEventHandler handler = this.PropertyChanged;
            if (handler != null)
            {
                var e = new PropertyChangedEventArgs(propertyName);
                handler(this, e);
            }
        }
    }
}