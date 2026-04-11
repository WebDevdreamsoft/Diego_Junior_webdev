#Quincena 
quincena = "quincena 12 de junio al 23 de junio"
dias_totales = "dias trabajados"
horas_totales = "horas trabajadas descontando el lunch"
salario = "salario aproximado"
hora = 17
#primer semana
sabado1 = 0
horas1 = 0
lunch1 = 0
total1 = horas1 - lunch1
#lunes
lunes = 1
horasl = 8
lunchl = 1
totall = horasl - lunchl
#martes
martes = 1
horasm = 10
lunchm = 1
totalm = horasm - lunchm
#miercoles
miercoles = 1
horasw = 11.5
lunchw = 2
totalw = horasw - lunchw
#jueves
jueves = 1
horasj = 3
lunchj = 0
totalj = horasj - lunchj
#viernes
viernes = 1
horasv = 7
lunchv = 1.5
totalv = horasv - lunchv
#sabado
sabado = 0
horass = 0
lunchs = 0
totals = horass - lunchs
#segunda semana
#lunes2
luness = 1
horasll = 8
lunchll = 1
totalll = horasll - lunchll
#martes2
martess = 1
horasmm = 5
lunchmm = 1
totalmm = horasmm - lunchmm
#miercoles2
miercoless = 1
horasww = 8
lunchww = 1
totalww = horasww - lunchww
#jueves2
juevess = 1
horasjj = 7.5
lunchjj = 2
totaljj = horasjj - lunchjj
#viernes2
vierness = 1
horasvv = 4
lunchvv = 1
totalvv = horasvv - lunchvv
#sabado2
sabadoo = 0
horasss = 0
lunchss = 0
totalss = horasss - lunchss
#resultados
print("quincena")
print(quincena)
print(dias_totales)
print(sabado1 + lunes + martes + miercoles + jueves + viernes + sabado +  luness + martess + miercoless + juevess + vierness +sabadoo)
print(horas_totales)
print(total1 + totall + totalm + totalw + totalj + totalv + totals + totalll + totalmm + totalww + totaljj + totalvv + totalss)
print(salario)
print(hora * total1 + hora * totall + hora * totalm +hora * totalw + hora * totalj + hora * totalv + hora * totals + hora * totalll + hora * totalmm + hora *totalww + hora * totaljj + hora * totalvv + hora * totalss)
