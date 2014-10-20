from tornado import websocket, web, ioloop
import json

class SocketHandler(websocket.WebSocketHandler):
	connections = {}
	number = -1

	def check_origin(self, origin):
		return True

	def open(self):
		print 'Connected to client'

	def on_message(self, message):
		if message.split(':')[0] == 'id':
			self.number = message.split(':')[1]

			print self.number

			if self.number in self.connections:
				self.connections[self.number].add(self)
			else:
				self.connections[self.number] = set()
				self.connections[self.number].add(self)

		print 'Sending Message: ' + message

		if message.split(':')[0] in ['play', 'pause']:
			count = 0

			for connection in self.connections[message.split(':')[1]]:
				connection.write_message(message.split(':')[0])
				count += 1

			print 'Sent message to ' + str(count) + ' clients'

	def on_close(self):
		self.connections[self.number].remove(self)
		print 'Disconnected from client'

app = web.Application([
    (r'/websocket', SocketHandler)
])

if __name__ == '__main__':
    app.listen(4242)
    ioloop.IOLoop.instance().start()