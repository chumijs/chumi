import { createApp, defineComponent } from 'vue';
import { testA, testB, testC } from './apis';

const App = defineComponent({
  setup() {
    return () => {
      return (
        <div>
          hello world
          <button
            onClick={() => {
              console.log(testA, testB, testC);
            }}
          >
            打开控制台，点击试试看
          </button>
        </div>
      );
    };
  }
});

createApp(App).mount('#app');
