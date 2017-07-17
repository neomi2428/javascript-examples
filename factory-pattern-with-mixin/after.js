/**
 * References for aggregation in ES6 style
 * - ES6 feature: http://es6-features.org/#ClassInheritanceFromExpressions
 * - repository: https://github.com/rse/aggregation
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

// Followings are a constant of each pizza type
const HAM_PIZZA = "ham pizza";
const SEAFOOD_PIZZA = "seafood pizza";
const VEGGIE_PIZZA = "veggie pizza";

// Followings are a pizza handler for each type
class HamPizzaHandler {
    getPizzaIngredients() {
        console.log('get 3 slices of ham to cook a ham pizza');
    }
    cookPizza() {
        console.log('cook a ham pizza for 3 minutes');
    }
}
class SeafoodPizzaHandler {
    getPizzaIngredients() {
        console.log('get 5 shrimps to cook a seafood pizza');
    }
    cookPizza() {
        console.log('cook a seafood pizza for 5 minutes');
    }
}
class VeggiePizzaHandler {
    getPizzaIngredients() {
        console.log('get 2 cucumbers to cook a veggie pizza');
    }
    cookPizza() {
        console.log('cook a veggie pizza for 2 minutes');
    }
}
class UnregisteredPizzaHandler {
    getPizzaIngredients() {
        console.log('no ingredient for that kind of pizza');
    }
    cookPizza() {
        console.log('cannot cook that kind of pizza');
    }
}

// This is a pizza handler factory
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
 * This is a mixin handling all behavior for pizza.
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
}

/**
 * Stock stores ingredients for pizza
 */
class Stock extends aggregation(Object, PizzaHandlerMixin) {
    /**
     * Check the availability of an ingredient
     */
    checkAvailability(ingredient) {
        console.log('Checking how many of ' + ingredient + ' we have...');
    }
}

/**
 * Chef cooks pizza
 */
class Chef extends aggregation(Object, PizzaHandlerMixin) {
    constructor () {
        super();
        this.stock = new Stock();
    }
    /**
     * make pizza with ingredients
     */
    makePizza (type) {
        this.stock.getPizzaIngredients(type);
        this.cookPizza(type);
    }
}

var chef = new Chef();
chef.makePizza(HAM_PIZZA);
chef.makePizza(SEAFOOD_PIZZA);
chef.makePizza(VEGGIE_PIZZA);
chef.makePizza('random pizza');
