/*
http://es6-features.org/#ClassInheritanceFromExpressions
https://github.com/rse/aggregation
*/
var aggregation = (baseClass, ...mixins) => {
    let base = class _Combined extends baseClass {
        constructor (...args) {
            super(...args);
            mixins.forEach((mixin) => {
                mixin.prototype.initializer.call(this);
            });
        }
    };
    let copyProps = (target, source) => {
        Object.getOwnPropertyNames(source)
            .concat(Object.getOwnPropertySymbols(source))
            .forEach((prop) => {
            if (prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/))
                return
            Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop))
        });
    }
    mixins.forEach((mixin) => {
        copyProps(base.prototype, mixin.prototype);
        copyProps(base, mixin);
    });
    return base;
};

const HAM_PIZZA = "ham pizza";
const SEAFOOD_PIZZA = "seafood pizza";
const VEGGIE_PIZZA = "veggie pizza";

class HamPizzaHandler {
    getPizzaIngredients() {
        console.log('get 3 slices of ham to cook a ham pizza');
    }
    cookPizza() {
        console.log('cook a ham pizza for 3 minutes');
    }
};

class SeafoodPizzaHandler {
    getPizzaIngredients() {
        console.log('get 5 shrimps to cook a seafood pizza');
    }
    cookPizza() {
        console.log('cook a seafood pizza for 5 minutes');
    }
};

class VeggiePizzaHandler {
    getPizzaIngredients() {
        console.log('get 2 cucumbers to cook a veggie pizza');
    }
    cookPizza() {
        console.log('cook a veggie pizza for 2 minutes');
    }
};

class UnregisteredPizzaHandler {
    getPizzaIngredients() {
        console.log('no ingredient for that kind of pizza');
    }
    cookPizza() {
        console.log('cannot cook that kind of pizza');
    }
}

class PizzaHandlerFactory {
    static getPizzaHandler (type) {
        switch (type) {
            case HAM_PIZZA:
                return new HamPizzaHandler();
            case SEAFOOD_PIZZA:
                return new SeafoodPizzaHandler();
            case VEGGIE_PIZZA:
                return new VeggiePizzaHandler();
            default:
                return new UnregisteredPizzaHandler();
        };
    }
}

/**
 * Instead of having an abstract class, we have a mixin class to force pizza handlers to implement each method.
 * Sicne JavaScript is not a strict type checking language like Java, we do not need to have it.
 * This mixin is like an interface.
 * Every time a new handler is added, all we need to do is add methods of this mixin to the new handler and implement them.
 * It can be a singleton class since it does not need to have any status.
 * We would not cover how to make it a singleton class.
 */
class PizzaHandlerMixin {
    initializer() {}
    /**
     * To get ingredients of a pizza
     * @param {String} type A pizza type
     */
    getPizzaIngredients (type) {
        PizzaHandlerFactory.getPizzaHandler(type).getPizzaIngredients();
    }
    /**
     * To cook a pizza
     * @param {String} type A pizza type
     */
    cookPizza (type) {
        PizzaHandlerFactory.getPizzaHandler(type).cookPizza();
    }
};

class Stock extends aggregation(Object, PizzaHandlerMixin) {
    checkAvailability(ingredient) {
        console.log('Checking how many of ' + ingredient + ' we have...');
    }
};

class Chef extends aggregation(Object, PizzaHandlerMixin) {
    constructor () {
        super();
        this.stock = new Stock();
    }
    makePizza (type) {
        this.stock.getPizzaIngredients(type);
        this.cookPizza(type);
    }
};

var chef = new Chef();
chef.makePizza(HAM_PIZZA);
chef.makePizza(SEAFOOD_PIZZA);
chef.makePizza(VEGGIE_PIZZA);
chef.makePizza('random pizza');
