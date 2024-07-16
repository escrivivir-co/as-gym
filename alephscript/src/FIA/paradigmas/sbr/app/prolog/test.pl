% Determina si es A.M. o P.M. basado en la hora
es_am(Hora) :- Hora >= 0, Hora < 12, write("Sí"), nl.
es_am(Hora) :- Hora < 0; Hora > 12, write("No"), nl.

es_pm(Hora) :- Hora >= 12, Hora < 24, write("Sí"), nl.
es_pm(Hora) :- Hora < 12; Hora < 12, write("No"), nl.

test(X) :- 
  write(' - \t[testw]\n'),
  X = 4;

% Knowledgebase
rank(a, 1).
rank(b, 2).
rank(c, 3).
rank(d, 4).

% predicate library
get_highest_ranking(X, Y, X) :-
  write('Gayir'),
  rank(X, RankX),
  rank(Y, RankY),
  RankX > RankY,
  write('Mayir').

get_highest_ranking(X, Y, Y) :-
    write('Manir'),
    rank(X, RankX),
    rank(Y, RankY),
    RankX < RankY,
    write('Menir').

cantar(1, Hora) :-
    es_pm(Hora),
    write('1 elefante se balanceaba...'), nl,
    write('Como veía que no se rompía, pero ya no había más elefantes para despedir.'),
    es_pm(Hora).