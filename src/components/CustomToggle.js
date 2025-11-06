const CustomToggle = ({text, id, checked, onToggle, icon}) => {
    return (
        <div class="relative flex gap-2">
        <div class="w-9 h-5">
          <input id={id} 
          type="checkbox" 
          class="peer appearance-none w-9 h-5 bg-slate-100 rounded-full checked:bg-slate-800 cursor-pointer transition-colors duration-300" 
          checked={checked}
          onChange={onToggle}
          />
    
          <label
            for={id}
            class="absolute top-0 left-0 h-5 w-5 cursor-pointer rounded-full border border-slate-300 bg-white shadow-sm transition-all duration-300 before:absolute before:top-2/4 before:left-2/4 before:block before:h-10 before:w-8 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-slate-400 before:opacity-0 before:transition-opacity hover:before:opacity-10 peer-checked:translate-x-4 peer-checked:border-slate-800"
          >
            <div
              class="top-2/4 left-2/4 inline-block -translate-x-2/4 -translate-y-2/4 rounded-full p-5"
              data-ripple-dark="true"
            ></div>
          </label>
        </div>
        <label for={id} class="flex gap-2 cursor-pointer">
        {icon && (
          <img src={icon} alt="" class="w-5 h-5 cursor-pointer" />
        )}
        <div class="text-slate-600 text-sm cursor-pointer hidden md:block">{text}</div>
          
        </label>
      </div>
    );
};

export default CustomToggle;