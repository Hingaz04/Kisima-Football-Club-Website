from exts import db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)

    def __repr__(self):
        return f"<User {self.email}>"

    def save(self):
        db.session.add(self)
        db.session.commit()


class News(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    image = db.Column(db.String(100), nullable=True)
    date = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f"<News {self.title}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class Fixture(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    homeTeamImage = db.Column(db.String(100), nullable=True)
    homeTeam = db.Column(db.String(100), nullable=False)
    awayTeamImage = db.Column(db.String(100), nullable=True)
    awayTeam = db.Column(db.String(100), nullable=False)
    venue = db.Column(db.String(100), nullable=False)
    date = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f"<Fixture {self.venue}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class Player(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    position = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f"<Player {self.name}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class AcademyPlayers(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    position = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f"<Player {self.name}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class AcademyNews(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    image = db.Column(db.String(100), nullable=True)
    date = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f"<Academy News{self.title}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class Results(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    homeTeamImage = db.Column(db.String(100), nullable=True)
    homeTeam = db.Column(db.String(100), nullable=False)
    awayTeamImage = db.Column(db.String(100), nullable=True)
    awayTeam = db.Column(db.String(100), nullable=False)
    result = db.Column(db.String(100), nullable=False)
    venue = db.Column(db.String(100), nullable=False)
    date = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f"<Result {self.venue}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class Weekend(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    weekendImages = db.Column(db.String(100), nullable=True)
    date = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f"<weekend {self.venue}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
