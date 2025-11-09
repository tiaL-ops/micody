import random 
words={ "cake": ["sweet", "dessert","chocolate","birthday",],
    "computer science" :["smell","smart","google","meta","jobless"],
    "suitcase" :['travel', "flight", "TSA","23kg"]
    }

"""
Let's make player array
where 
0 = human
1 = bot1
2= bot2

"""




#this function should get the current word given and return the new _word form the bot
#playerWords will be = pW= [["","",""],["","",""],["","",""]]  should be like the word said so far
def play(word,playerWords):
    words1= words.copy()
    for i in range(3):
        if i != 0 : #let's focus on bot first
            if players[i] == 0 : #they are not imposter 
                n=len(words1[word])
                idx=random.randint(n)
                new_word=words1[word].pop(idx) #pop so that they wont remember it 
                return new_word
            else: #the bot is imposter, the goal is to make it play imposter but not as obvious, should guess 
                curr=[playerWords[0][-1]] #cuz we know that the 0 is always human
                #for simplicity we will pick the last words
                #check if that word is in words

                if curr in words:
                    n=len(words1[word])
                    idx=random.randint(curr)
                    new_word=words1[word].pop(idx)
                else: #look up the word in the entire dataset xD as dictionary? it is 01?
                    #need to find a way more efficient but , the goal is that we going tto dataset look up if that word exist there even as value, 
                    #then get one of his neigbhour value
                    for i in words1:
                        for j in i :
                            if j == curr:
                                #atp this can be a function on its own
                                n=len(words1[i])
                                idx=random.randint(n)
                                new_word=words1[word].pop(idx)
                                return new_word
players=[0,0,0]

#lets make it 1 who is the imposter , randomly assigned 
players[random.randint(0,3)]=1 

number_rounds=4
playerWords=[[] * len(players)]

for _ in range(number_rounds):
    for i in range(len(players)):
        if i == 0 :
            curr_word=input()

            

                

                




