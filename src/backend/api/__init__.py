class API:
    def init(self):
        pass

    from .files import writeBundle, readBundle

    def logger(self, msg):
        print(msg)

