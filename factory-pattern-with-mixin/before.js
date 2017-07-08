const HAM_PIZZA = "ham pizza";
const SEAFOOD_PIZZA = "seafood pizza";
const VEGGIE_PIZZA = "veggie pizza";

class Stock {
    checkAvailability(ingredient) {
        console.log('Checking how many of ' + ingredient + ' we have...');
    }
    getPizzaIngredients (type) {
        if (type === HAM_PIZZA) {
            console.log('get 3 slices of ham to cook a ham pizza');
        } else if (type === SEAFOOD_PIZZA) {
            console.log('get 5 shrimps to cook a seafood pizza');
        } else if (type === VEGGIE_PIZZA) {
            console.log('get 2 cucumbers to cook a veggie pizza');
        } else {
            console.log('no ingredient for ' + type);
        }
    }
};

class Chef {
    constructor () {
        this.stock = new Stock();
    }
    makePizza (type) {
        this.stock.getPizzaIngredients(type);
        this.cookPizza(type);
    }
    cookPizza (type) {
        if (type === HAM_PIZZA) {
            console.log('cook a ham pizza for 3 minutes');
        } else if (type === SEAFOOD_PIZZA) {
            console.log('cook a seafood pizza for 5 minutes');
        } else if (type === VEGGIE_PIZZA) {
            console.log('cook a veggie pizza for 2 minutes');
        } else {
            console.log('cannot cook ' + type);
        }
    }
};

var chef = new Chef();
chef.makePizza(HAM_PIZZA);
chef.makePizza(SEAFOOD_PIZZA);
chef.makePizza(VEGGIE_PIZZA);
chef.makePizza('random pizza');
