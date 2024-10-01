type IconProps = React.ComponentProps<"svg">

export const Icons = {
   pencil: (props: IconProps) => (
      <svg
         className="size-5"
         viewBox="0 0 24 24"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         {...props}
      >
         <path
            opacity="0.15"
            d="M3.12568 17.5726C3.08011 17.7497 3.07546 17.9381 3.06616 18.3151L3 20.9955L5.72665 20.9999C6.11608 21.0005 6.31079 21.0008 6.49406 20.9568C6.65654 20.9178 6.81188 20.8534 6.95435 20.7658C7.11505 20.6669 7.25274 20.5287 7.52811 20.2521L20.5014 7.22177C20.5329 7.19018 20.5486 7.17439 20.5622 7.16005C21.0616 6.63294 21.1427 5.83327 20.7594 5.21582C20.2699 4.42508 19.6065 3.75508 18.8267 3.25131C18.204 2.84896 17.3862 2.93708 16.8626 3.46297L3.8099 16.573C3.54444 16.8396 3.41171 16.973 3.31544 17.1282C3.23007 17.2658 3.16608 17.4156 3.12568 17.5726Z"
            fill="currentColor"
         />
         <path
            d="M12 21C16.018 17.7256 16.0891 24.3574 21 19M3 20.9955L5.72665 20.9999C6.11608 21.0005 6.31079 21.0008 6.49406 20.9568C6.65654 20.9178 6.81188 20.8534 6.95435 20.7658C7.11505 20.6669 7.25274 20.5287 7.52811 20.2521L20.5014 7.22177C21.0315 6.68941 21.1632 5.86631 20.7594 5.21582C20.2713 4.42948 19.6037 3.75331 18.8267 3.25131C18.204 2.84896 17.3862 2.93708 16.8626 3.46297L3.8099 16.573C3.54444 16.8396 3.41171 16.973 3.31544 17.1282C3.23007 17.2658 3.16608 17.4156 3.12568 17.5726C3.08011 17.7497 3.07546 17.9381 3.06616 18.3151L3 20.9955Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   ),
   ellipsis: (props: IconProps) => (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         fill="none"
         viewBox="0 0 24 24"
         strokeWidth="2"
         stroke="currentColor"
         {...props}
      >
         <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
         />
      </svg>
   ),
   tag: (props: IconProps) => (
      <svg
         width="24"
         height="24"
         viewBox="0 0 24 24"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         {...props}
      >
         <path
            d="M8.5105 8.51245H8.5305M15.7725 5.87298L18.194 8.29448C19.5101 9.6106 20.1682 10.2687 20.5277 10.9743C21.2543 12.4003 21.2543 14.0881 20.5277 15.5142C20.1682 16.2198 19.5101 16.8779 18.194 18.194C16.8779 19.5101 16.2198 20.1682 15.5142 20.5277C14.0881 21.2543 12.4003 21.2543 10.9743 20.5277C10.2687 20.1682 9.6106 19.5101 8.29448 18.194L5.87297 15.7725C4.75976 14.6593 4.20315 14.1026 3.81725 13.45C3.47524 12.8716 3.23281 12.2399 3.1001 11.5811C2.95035 10.8379 2.99172 10.0518 3.07447 8.47968L3.11768 7.65876C3.19793 6.13396 3.23805 5.37156 3.55489 4.78079C3.83397 4.26041 4.26041 3.83397 4.78079 3.55489C5.37156 3.23805 6.13396 3.19793 7.65876 3.11768L8.47968 3.07447C10.0518 2.99172 10.8379 2.95035 11.5811 3.1001C12.2399 3.23281 12.8716 3.47524 13.45 3.81725C14.1026 4.20315 14.6593 4.75976 15.7725 5.87298ZM9.4895 8.48779C9.4895 9.04008 9.04179 9.48779 8.4895 9.48779C7.93722 9.48779 7.4895 9.04008 7.4895 8.48779C7.4895 7.93551 7.93722 7.48779 8.4895 7.48779C9.04179 7.48779 9.4895 7.93551 9.4895 8.48779Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   ),
   link: (props: IconProps) => (
      <svg
         width="24"
         height="24"
         viewBox="0 0 24 24"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         {...props}
      >
         <path
            opacity="0.5"
            d="M10.5858 6.3432L11.2929 5.6361C13.2455 3.68348 16.4113 3.68348 18.364 5.6361C20.3166 7.58872 20.3166 10.7545 18.364 12.7072L17.6569 13.4143M6.34314 10.5858L5.63604 11.293C3.68341 13.2456 3.68341 16.4114 5.63604 18.364C7.58866 20.3166 10.7545 20.3166 12.7071 18.364L13.4142 17.6569"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
         />
         <path
            d="M14.1213 9.87866L9.87866 14.1213"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   ),
   token: (props: IconProps) => (
      <svg
         viewBox="0 0 24 24"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         {...props}
      >
         <path
            d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
         <path
            d="M10.3027 9.69707C10.8967 9.10305 11.1938 8.80604 11.5362 8.69475C11.8375 8.59687 12.162 8.59687 12.4633 8.69475C12.8058 8.80604 13.1028 9.10305 13.6968 9.69707L14.3027 10.303C14.8967 10.897 15.1938 11.194 15.305 11.5365C15.4029 11.8378 15.4029 12.1623 15.305 12.4635C15.1938 12.806 14.8967 13.103 14.3027 13.6971L13.6968 14.303C13.1028 14.897 12.8058 15.194 12.4633 15.3053C12.162 15.4032 11.8375 15.4032 11.5362 15.3053C11.1938 15.194 10.8967 14.897 10.3027 14.303L9.69683 13.6971C9.1028 13.103 8.80579 12.806 8.69451 12.4635C8.59662 12.1623 8.59662 11.8378 8.69451 11.5365C8.80579 11.194 9.1028 10.897 9.69683 10.303L10.3027 9.69707Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   ),
   shift: (props: IconProps) => (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         width="24"
         height="24"
         viewBox="0 0 24 24"
         fill="none"
         stroke="currentColor"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
         {...props}
      >
         <path d="M9 18v-6H5l7-7 7 7h-4v6H9z" />
      </svg>
   ),
   plus: (props: IconProps) => (
      <svg
         width="24"
         height="24"
         viewBox="0 0 24 24"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         {...props}
      >
         <path
            d="M12 19V12M12 12V5M12 12L5 12M12 12L19 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   ),
   arrowLeft: (props: IconProps) => (
      <svg
         width="24"
         height="24"
         viewBox="0 0 24 24"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         {...props}
      >
         <path
            d="M9.8304 6C7.727 7.55556 5.83783 9.37278 4.20952 11.4057C4.06984 11.5801 4 11.79 4 12M9.8304 18C7.727 16.4444 5.83783 14.6272 4.20952 12.5943C4.06984 12.4199 4 12.21 4 12M4 12H20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   ),
   chevronDown: (props: IconProps) => (
      <svg
         width="24"
         height="24"
         viewBox="0 0 24 24"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         {...props}
      >
         <path
            d="M8 10.1392C9.06206 11.601 10.3071 12.9104 11.7021 14.0334C11.8774 14.1744 12.1226 14.1744 12.2979 14.0334C13.6929 12.9104 14.9379 11.601 16 10.1392"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   ),
   check: (props: IconProps) => (
      <svg
         viewBox="0 0 24 24"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         {...props}
      >
         <path
            d="M5 12.7132L10.0168 17.7247L10.4177 17.0238C12.5668 13.2658 15.541 10.0448 19.1161 7.60354L20 7"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   ),
   xMark: (props: IconProps) => (
      <svg
         width="24"
         height="24"
         viewBox="0 0 24 24"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         {...props}
      >
         <path
            d="M6 18L12 12M12 12L18 6M12 12L6 6M12 12L18 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   ),
   home: (props: IconProps) => (
      <svg
         width="24"
         height="24"
         viewBox="0 0 24 24"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         {...props}
      >
         <path
            d="M3 12.7587C3 11.7418 3 11.2334 3.11866 10.7571C3.22385 10.3349 3.39721 9.93275 3.63191 9.56641C3.89667 9.15313 4.26632 8.80402 5.00561 8.1058L7.60561 5.65025C9.15211 4.18966 9.92537 3.45937 10.8075 3.18385C11.584 2.94132 12.416 2.94132 13.1925 3.18385C14.0746 3.45937 14.8479 4.18966 16.3944 5.65025L18.9944 8.1058C19.7337 8.80402 20.1033 9.15313 20.3681 9.56641C20.6028 9.93275 20.7761 10.3349 20.8813 10.7571C21 11.2334 21 11.7418 21 12.7587V14.6C21 16.8402 21 17.9603 20.564 18.816C20.1805 19.5686 19.5686 20.1805 18.816 20.564C18.0128 20.9732 16.9767 20.9983 15 20.9999C13 21.0014 11 21.0014 9 20.9999C7.0233 20.9983 5.98717 20.9732 5.18404 20.564C4.43139 20.1805 3.81947 19.5686 3.43597 18.816C3 17.9603 3 16.8402 3 14.6V12.7587Z"
            fill="currentColor"
            className="opacity-0 transition-opacity group-aria-[current=page]:opacity-15"
         />
         <path
            d="M15 20.9999V16C15 14.3431 13.6569 13 12 13C10.3431 13 9 14.3431 9 16V20.9999M15 20.9999C16.9767 20.9983 18.0128 20.9732 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C21 17.9603 21 16.8402 21 14.6V12.7587C21 11.7418 21 11.2334 20.8813 10.7571C20.7761 10.3349 20.6028 9.93275 20.3681 9.56641C20.1033 9.15313 19.7337 8.80402 18.9944 8.1058L16.3944 5.65025C14.8479 4.18966 14.0746 3.45937 13.1925 3.18385C12.416 2.94132 11.584 2.94132 10.8075 3.18385C9.92537 3.45937 9.15211 4.18966 7.60561 5.65025L5.00561 8.1058C4.26632 8.80402 3.89667 9.15313 3.63191 9.56641C3.39721 9.93275 3.22385 10.3349 3.11866 10.7571C3 11.2334 3 11.7418 3 12.7587V14.6C3 16.8402 3 17.9603 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.98717 20.9732 7.0233 20.9983 9 20.9999M15 20.9999C13 21.0014 11 21.0014 9 20.9999"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   ),
   inbox: (props: IconProps) => (
      <div className="relative">
         <span className="absolute top-0 right-0 block size-3 scale-0 rounded-full border-[2.5px] border-background bg-primary transition-transform group-data-[has-unread=true]:scale-100" />
         <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
         >
            <path
               fillRule="evenodd"
               clipRule="evenodd"
               d="M13.8756 3H10.1244C9.05616 2.99998 8.19029 2.99997 7.49746 3.08568C6.77572 3.17496 6.15892 3.36522 5.6313 3.80412C5.10368 4.24303 4.80432 4.81489 4.58514 5.50831C4.37474 6.17396 4.21714 7.02537 4.02269 8.07576L3.28911 12.0382C3.16636 12.7012 3.09782 13.0714 3.05734 13.4472C3.04611 13.5514 3.03653 13.6558 3.0286 13.7603C2.99999 14.1372 2.99999 14.5137 3 15.1879V15.261C2.99999 16.3059 2.99998 17.1483 3.07526 17.8205C3.15308 18.5154 3.31856 19.1132 3.70934 19.6272C3.89951 19.8773 4.1227 20.1005 4.37281 20.2907C4.88678 20.6814 5.48463 20.8469 6.17954 20.9247C6.85169 21 7.69412 21 8.73892 21H15.2611C16.3058 21 17.1483 21 17.8205 20.9247C18.5154 20.8469 19.1132 20.6814 19.6272 20.2907C19.8773 20.1005 20.1005 19.8773 20.2907 19.6272C20.6814 19.1132 20.8469 18.5154 20.9247 17.8205C21 17.1483 21 16.3059 21 15.2611V15.1879C21 14.5136 21 14.1372 20.9714 13.7603C20.9635 13.6558 20.9539 13.5514 20.9427 13.4472C20.9022 13.0714 20.8336 12.7012 20.7109 12.0381L19.9773 8.0758C19.7829 7.02539 19.6253 6.17397 19.4149 5.50831C19.1957 4.81489 18.8963 4.24303 18.3687 3.80412C17.8411 3.36522 17.2243 3.17496 16.5025 3.08568C15.8097 2.99997 14.9438 2.99998 13.8756 3ZM6.52092 4.87356C6.76663 4.66917 7.08988 4.53778 7.66824 4.46624C8.26572 4.39233 9.04531 4.39109 10.1697 4.39109H13.8303C14.9547 4.39109 15.7343 4.39233 16.3318 4.46624C16.9101 4.53778 17.2334 4.66917 17.4791 4.87356C17.7248 5.07795 17.9128 5.37188 18.0885 5.92755C18.2699 6.5016 18.413 7.26794 18.6177 8.37357L19.3373 12.2605C19.3949 12.5714 19.4384 12.8068 19.4719 13L17.3663 13C17.0575 13 16.767 12.9999 16.5231 13.0273C16.2513 13.0578 15.9655 13.1282 15.6965 13.3166C15.4274 13.5051 15.2636 13.7496 15.142 13.9946C15.033 14.2145 14.9337 14.4875 14.8282 14.7777L14.7739 14.9272C14.6524 15.2613 14.5814 15.4534 14.5142 15.5888C14.4839 15.6498 14.4635 15.68 14.4526 15.694C14.4475 15.7005 14.4447 15.7033 14.444 15.7039L14.443 15.7048L14.4419 15.7054C14.441 15.7058 14.4374 15.7075 14.4296 15.7101C14.4127 15.7156 14.3774 15.7245 14.3097 15.7321C14.1595 15.7489 13.9547 15.75 13.5991 15.75H10.4009C10.0453 15.75 9.8405 15.7489 9.69033 15.7321C9.62265 15.7245 9.58732 15.7156 9.5704 15.7101C9.56665 15.7089 9.56387 15.7078 9.5619 15.7071C9.55975 15.7062 9.55857 15.7056 9.55814 15.7054L9.557 15.7048L9.55599 15.7039C9.55534 15.7033 9.5525 15.7005 9.54743 15.694C9.53651 15.68 9.51606 15.6498 9.48579 15.5888C9.41864 15.4534 9.34761 15.2613 9.22611 14.9272L9.17178 14.7778C9.06628 14.4875 8.96705 14.2145 8.85796 13.9946C8.7364 13.7496 8.57255 13.5051 8.30354 13.3166C8.03454 13.1282 7.74875 13.0578 7.47691 13.0273C7.23296 12.9999 6.94248 13 6.63366 13L4.5281 13C4.56164 12.8068 4.60511 12.5714 4.66268 12.2605L5.38228 8.37357C5.58697 7.26794 5.73011 6.5016 5.91155 5.92755C6.08718 5.37188 6.27522 5.07795 6.52092 4.87356ZM4.39304 14.5C4.39117 14.69 4.39109 14.9203 4.39109 15.2194C4.39109 16.3156 4.39211 17.08 4.4577 17.6656C4.52174 18.2375 4.64 18.5528 4.81669 18.7852C4.9308 18.9353 5.06471 19.0692 5.21478 19.1833C5.44716 19.36 5.76255 19.4783 6.33437 19.5423C6.92003 19.6079 7.68436 19.6089 8.78056 19.6089H15.2194C16.3156 19.6089 17.08 19.6079 17.6656 19.5423C18.2375 19.4783 18.5528 19.36 18.7852 19.1833C18.9353 19.0692 19.0692 18.9353 19.1833 18.7852C19.36 18.5528 19.4783 18.2375 19.5423 17.6656C19.6079 17.08 19.6089 16.3156 19.6089 15.2194C19.6089 14.9203 19.6088 14.69 19.607 14.5H17.4009C17.0453 14.5 16.8405 14.5011 16.6903 14.5179C16.6226 14.5255 16.5873 14.5345 16.5704 14.5399C16.5626 14.5425 16.559 14.5442 16.5581 14.5446L16.557 14.5452L16.556 14.5461C16.5553 14.5467 16.5525 14.5495 16.5474 14.556C16.5365 14.57 16.5161 14.6002 16.4858 14.6612C16.4186 14.7966 16.3476 14.9887 16.2261 15.3228L16.1718 15.4722C16.0663 15.7625 15.967 16.0355 15.858 16.2554C15.7364 16.5004 15.5726 16.745 15.3035 16.9334C15.0345 17.1218 14.7487 17.1922 14.4769 17.2227C14.233 17.2501 13.9425 17.25 13.6337 17.25H10.3663C10.0575 17.25 9.76703 17.2501 9.52309 17.2227C9.25125 17.1922 8.96547 17.1218 8.69646 16.9334C8.42745 16.745 8.2636 16.5004 8.14204 16.2554C8.03295 16.0355 7.93372 15.7625 7.82821 15.4722L7.77389 15.3228C7.65239 14.9887 7.58136 14.7966 7.51421 14.6612C7.48394 14.6002 7.46349 14.57 7.45257 14.556C7.4475 14.5495 7.44466 14.5467 7.44401 14.5461L7.443 14.5452L7.44186 14.5446C7.44104 14.5442 7.43744 14.5425 7.4296 14.5399C7.41268 14.5345 7.37735 14.5255 7.30967 14.5179C7.1595 14.5011 6.95467 14.5 6.59915 14.5H4.39304Z"
               fill="currentColor"
               stroke="currentColor"
               strokeWidth="0.5"
            />
            <path
               d="M4.05408 8.06963L3.26591 12.4467L3.26591 12.4467C3.12551 13.2264 3.05531 13.6163 3.0144 14.0099C3.00378 14.1121 3.00765 14.0568 3 14.1593H6.56407C7.24447 14.1593 7.58467 14.1593 7.84421 14.3462C8.10374 14.5331 8.22 14.8618 8.45253 15.5192L8.49526 15.6401C8.72778 16.2975 8.84404 16.6262 9.10358 16.8131C9.36311 17 9.70331 17 10.3837 17H13.5971C14.2775 17 14.6177 17 14.8772 16.8131C15.1368 16.6262 15.253 16.2975 15.4855 15.6401L15.5283 15.5192C15.7608 14.8618 15.8771 14.5331 16.1366 14.3462C16.3961 14.1593 16.7363 14.1593 17.4167 14.1593H21C20.9923 14.0568 20.9962 14.1121 20.9855 14.0099C20.9446 13.6163 20.8744 13.2263 20.734 12.4467L19.9459 8.06963C19.5093 5.64527 19.291 4.43309 18.4532 3.71654C17.6154 3 16.4164 3 14.0183 3H9.98165C7.58356 3 6.38451 3 5.54671 3.71654C4.7089 4.43309 4.49063 5.64527 4.05408 8.06963Z"
               fill="currentColor"
               className="opacity-0 transition-opacity group-aria-[current=page]:opacity-15"
            />
            <path
               d="M4.03752 14C4.02813 14.0962 4.03284 14.0519 4.02607 14.1484C4 14.52 4 14.8933 4 15.6399C4 17.9315 4 19.0773 4.55571 19.865C4.69498 20.0625 4.85682 20.2395 5.03726 20.3919C5.7572 21 6.80433 21 8.89859 21H15.1014C17.1957 21 18.2428 21 18.9627 20.3919C19.1432 20.2395 19.305 20.0625 19.4443 19.865C20 19.0773 20 17.9315 20 15.6399C20 14.8933 20 14.52 19.9739 14.1484C19.9672 14.0519 19.9719 14.0962 19.9625 14L16.7923 14C16.1903 14 15.8894 14 15.6597 14.176C15.4301 14.352 15.3273 14.6615 15.1216 15.2805L15.0837 15.3942C14.878 16.0133 14.7752 16.3228 14.5456 16.4987C14.3159 16.6747 14.015 16.6747 13.413 16.6747H10.5701C9.96811 16.6747 9.66713 16.6747 9.43752 16.4987C9.2079 16.3228 9.10504 16.0132 8.89933 15.3942L8.86152 15.2805C8.65581 14.6615 8.55295 14.352 8.32333 14.176C8.09372 14 7.79274 14 7.19078 14H4.03752Z"
               fill="currentColor"
               className="opacity-0 transition-opacity group-aria-[current=page]:opacity-15"
            />
         </svg>
      </div>
   ),
   issues: (props: IconProps) => (
      <svg
         width="24"
         height="24"
         viewBox="0 0 24 24"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         {...props}
      >
         <path
            d="M4.29927 8.58144C3.56321 8.23337 3.19518 8.05933 3.07708 7.82383C2.97431 7.61888 2.97431 7.38112 3.07708 7.17617C3.19518 6.94067 3.56321 6.76663 4.29927 6.41856L10.5707 3.45291C11.0948 3.20508 11.3568 3.08117 11.6317 3.0324C11.8751 2.9892 12.1249 2.9892 12.3683 3.0324C12.6432 3.08117 12.9052 3.20508 13.4293 3.45291L19.7007 6.41856C20.4368 6.76663 20.8048 6.94067 20.9229 7.17617C21.0257 7.38112 21.0257 7.61888 20.9229 7.82383C20.8048 8.05933 20.4368 8.23337 19.7007 8.58144L13.4293 11.5471C12.9052 11.7949 12.6432 11.9188 12.3683 11.9676C12.1249 12.0108 11.8751 12.0108 11.6317 11.9676C11.3568 11.9188 11.0948 11.7949 10.5707 11.5471L4.29927 8.58144Z"
            fill="currentColor"
            className="opacity-0 transition-opacity group-aria-[current=page]:opacity-15"
         />
         <path
            d="M21 12C20.8809 12.2538 20.5097 12.4413 19.7673 12.8164L13.4417 16.012C12.9131 16.279 12.6488 16.4125 12.3715 16.4651C12.126 16.5116 11.874 16.5116 11.6285 16.4651C11.3513 16.4125 11.0869 16.279 10.5583 16.012L4.23275 12.8164C3.49033 12.4413 3.11912 12.2538 3 12M21 16.5C20.8809 16.7538 20.5097 16.9413 19.7673 17.3164L13.4417 20.512C12.9131 20.779 12.6488 20.9125 12.3715 20.9651C12.126 21.0116 11.874 21.0116 11.6285 20.9651C11.3512 20.9125 11.0869 20.779 10.5583 20.512L4.23275 17.3164C3.49033 16.9413 3.11912 16.7538 3 16.5M13.4293 11.5471L19.7007 8.58144C20.4368 8.23337 20.8048 8.05933 20.9229 7.82383C21.0257 7.61888 21.0257 7.38112 20.9229 7.17617C20.8048 6.94067 20.4368 6.76663 19.7007 6.41856L13.4293 3.45291C12.9052 3.20508 12.6432 3.08117 12.3683 3.0324C12.1249 2.9892 11.8751 2.9892 11.6317 3.0324C11.3568 3.08117 11.0948 3.20508 10.5707 3.45291L4.29927 6.41856C3.56321 6.76663 3.19518 6.94067 3.07708 7.17617C2.97431 7.38112 2.97431 7.61888 3.07708 7.82383C3.19518 8.05933 3.56321 8.23337 4.29927 8.58144L10.5707 11.5471C11.0948 11.7949 11.3568 11.9188 11.6317 11.9676C11.8751 12.0108 12.1249 12.0108 12.3683 11.9676C12.6432 11.9188 12.9052 11.7949 13.4293 11.5471Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   ),
   people: (props: IconProps) => (
      <svg
         width="24"
         height="24"
         viewBox="0 0 24 24"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         {...props}
      >
         <g className="opacity-0 transition-opacity group-aria-[current=page]:opacity-15">
            <path
               d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
               fill="currentColor"
            />
            <path
               d="M16 15H8C5.79086 15 4 16.7909 4 19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19C20 16.7909 18.2091 15 16 15Z"
               fill="currentColor"
            />
         </g>
         <path
            d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
         <path
            d="M16 15H8C5.79086 15 4 16.7909 4 19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19C20 16.7909 18.2091 15 16 15Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   ),
   settings: (props: IconProps) => (
      <svg
         width="24"
         height="24"
         viewBox="0 0 24 24"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         {...props}
      >
         <path
            d="M14.1026 4.417L13.7992 4.11982L13.7992 4.11981C13.1682 3.50174 12.8527 3.1927 12.4903 3.07661C12.1714 2.97446 11.8286 2.97446 11.5097 3.07661C11.1473 3.1927 10.8318 3.50174 10.2008 4.11981L10.2008 4.11982L9.89735 4.417L9.89735 4.41701C9.62451 4.68424 9.48809 4.81786 9.32984 4.91393C9.18951 4.99913 9.03695 5.06232 8.87749 5.1013C8.69764 5.14527 8.5067 5.14725 8.12481 5.15122H8.12481L7.70012 5.15562C6.81685 5.16479 6.37522 5.16937 6.03688 5.34354C5.73918 5.49678 5.49678 5.73918 5.34354 6.03688C5.16937 6.37522 5.16479 6.81685 5.15562 7.70012L5.15122 8.12481V8.12481C5.14725 8.5067 5.14527 8.69764 5.1013 8.87749C5.06232 9.03695 4.99913 9.18951 4.91393 9.32984C4.81786 9.48809 4.68424 9.62451 4.41701 9.89735L4.417 9.89735L4.11982 10.2008L4.11981 10.2008C3.50173 10.8318 3.1927 11.1473 3.07661 11.5097C2.97446 11.8286 2.97446 12.1714 3.07661 12.4903C3.1927 12.8527 3.50174 13.1682 4.11981 13.7992L4.11982 13.7992L4.417 14.1026C4.68424 14.3755 4.81786 14.5119 4.91393 14.6702C4.99913 14.8105 5.06232 14.963 5.1013 15.1225C5.14527 15.3024 5.14725 15.4933 5.15122 15.8752L5.15562 16.2999C5.16479 17.1831 5.16937 17.6248 5.34354 17.9631C5.49678 18.2608 5.73918 18.5032 6.03688 18.6565C6.37522 18.8306 6.81685 18.8352 7.70012 18.8444L8.12481 18.8488C8.5067 18.8527 8.69764 18.8547 8.87749 18.8987C9.03695 18.9377 9.18951 19.0009 9.32984 19.0861C9.48809 19.1821 9.62451 19.3158 9.89735 19.583L10.2008 19.8802L10.2008 19.8802C10.8318 20.4983 11.1473 20.8073 11.5097 20.9234C11.8286 21.0255 12.1714 21.0255 12.4903 20.9234C12.8527 20.8073 13.1682 20.4983 13.7992 19.8802L13.7992 19.8802L14.1026 19.583C14.3755 19.3158 14.5119 19.1821 14.6702 19.0861C14.8105 19.0009 14.963 18.9377 15.1225 18.8987C15.3024 18.8547 15.4933 18.8527 15.8752 18.8488L16.2999 18.8444C17.1831 18.8352 17.6248 18.8306 17.9631 18.6565C18.2608 18.5032 18.5032 18.2608 18.6565 17.9631C18.8306 17.6248 18.8352 17.1831 18.8444 16.2999L18.8488 15.8752C18.8527 15.4933 18.8547 15.3024 18.8987 15.1225C18.9377 14.963 19.0009 14.8105 19.0861 14.6702C19.1821 14.5119 19.3158 14.3755 19.583 14.1026L19.8802 13.7992L19.8802 13.7992C20.4983 13.1682 20.8073 12.8527 20.9234 12.4903C21.0255 12.1714 21.0255 11.8286 20.9234 11.5097C20.8073 11.1473 20.4983 10.8318 19.8802 10.2008L19.8802 10.2008L19.583 9.89735C19.3158 9.62451 19.1821 9.48809 19.0861 9.32984C19.0009 9.18951 18.9377 9.03695 18.8987 8.87749C18.8547 8.69764 18.8527 8.5067 18.8488 8.12481L18.8444 7.70012C18.8352 6.81685 18.8306 6.37522 18.6565 6.03688C18.5032 5.73918 18.2608 5.49678 17.9631 5.34354C17.6248 5.16937 17.1831 5.16479 16.2999 5.15562L15.8752 5.15122C15.4933 5.14725 15.3024 5.14527 15.1225 5.1013C14.963 5.06232 14.8105 4.99913 14.6702 4.91393C14.5119 4.81786 14.3755 4.68424 14.1026 4.417Z"
            fill="currentColor"
            className="opacity-0 transition-opacity group-aria-[current=page]:opacity-15"
         />
         <path
            d="M10.2007 4.11982C10.8318 3.50174 11.1473 3.1927 11.5097 3.07661C11.8285 2.97446 12.1713 2.97446 12.4902 3.07661C12.8526 3.1927 13.1681 3.50174 13.7992 4.11982L14.1026 4.417C14.3754 4.68424 14.5118 4.81786 14.6701 4.91393C14.8104 4.99913 14.963 5.06232 15.1225 5.1013C15.3023 5.14527 15.4932 5.14725 15.8751 5.15122L16.2998 5.15562C17.1831 5.16479 17.6247 5.16937 17.9631 5.34354C18.2608 5.49678 18.5032 5.73918 18.6564 6.03688C18.8306 6.37522 18.8351 6.81685 18.8443 7.70012L18.8487 8.12481C18.8527 8.5067 18.8547 8.69764 18.8986 8.87749C18.9376 9.03695 19.0008 9.18951 19.086 9.32984C19.1821 9.48809 19.3157 9.62451 19.5829 9.89735L19.8801 10.2008C20.4982 10.8318 20.8072 11.1473 20.9233 11.5097C21.0255 11.8286 21.0255 12.1714 20.9233 12.4903C20.8072 12.8527 20.4982 13.1682 19.8801 13.7992L19.5829 14.1026C19.3157 14.3755 19.1821 14.5119 19.086 14.6702C19.0008 14.8105 18.9376 14.963 18.8986 15.1225C18.8547 15.3024 18.8527 15.4933 18.8487 15.8752L18.8443 16.2999C18.8351 17.1831 18.8306 17.6248 18.6564 17.9631C18.5032 18.2608 18.2608 18.5032 17.9631 18.6565C17.6247 18.8306 17.1831 18.8352 16.2998 18.8444L15.8751 18.8488C15.4932 18.8527 15.3023 18.8547 15.1225 18.8987C14.963 18.9377 14.8104 19.0009 14.6701 19.0861C14.5118 19.1821 14.3754 19.3158 14.1026 19.583L13.7992 19.8802C13.1681 20.4983 12.8526 20.8073 12.4902 20.9234C12.1713 21.0255 11.8285 21.0255 11.5097 20.9234C11.1473 20.8073 10.8318 20.4983 10.2007 19.8802L9.89729 19.583C9.62445 19.3158 9.48803 19.1821 9.32978 19.0861C9.18945 19.0009 9.03689 18.9377 8.87742 18.8987C8.69758 18.8547 8.50664 18.8527 8.12475 18.8488L7.70006 18.8444C6.81679 18.8352 6.37516 18.8306 6.03682 18.6565C5.73912 18.5032 5.49672 18.2608 5.34348 17.9631C5.16931 17.6248 5.16473 17.1831 5.15556 16.2999L5.15115 15.8752C5.14719 15.4933 5.14521 15.3024 5.10124 15.1225C5.06226 14.963 4.99907 14.8105 4.91387 14.6702C4.81779 14.5119 4.68418 14.3755 4.41694 14.1026L4.11976 13.7992C3.50168 13.1682 3.19264 12.8527 3.07655 12.4903C2.9744 12.1714 2.9744 11.8286 3.07655 11.5097C3.19264 11.1473 3.50168 10.8318 4.11976 10.2008L4.41694 9.89735C4.68418 9.62451 4.81779 9.48809 4.91387 9.32984C4.99907 9.18951 5.06226 9.03695 5.10124 8.87749C5.14521 8.69764 5.14719 8.5067 5.15115 8.12481L5.15556 7.70012C5.16473 6.81685 5.16931 6.37522 5.34348 6.03688C5.49672 5.73918 5.73912 5.49678 6.03682 5.34354C6.37516 5.16937 6.81679 5.16479 7.70006 5.15562L8.12475 5.15122C8.50664 5.14725 8.69758 5.14527 8.87742 5.1013C9.03689 5.06232 9.18945 4.99913 9.32978 4.91393C9.48803 4.81786 9.62445 4.68424 9.89729 4.417L10.2007 4.11982Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
         <path
            d="M10.991 12C10.991 11.4477 11.4479 11 12.0001 11C12.5524 11 13.0093 11.4477 13.0093 12C13.0093 12.5523 12.5524 13 12.0001 13C11.4479 13 10.991 12.5523 10.991 12Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   ),
   copy: (props: IconProps) => (
      <svg
         viewBox="0 0 24 24"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         {...props}
      >
         <path
            opacity="0.15"
            d="M3 14C3 12.1387 3 11.2081 3.24472 10.4549C3.73931 8.93273 4.93273 7.73931 6.45492 7.24472C6.65258 7.18049 6.86246 7.13312 7.09819 7.09819C7.76066 7 8.6272 7 10 7C11.8613 7 12.7919 7 13.5451 7.24472C15.0673 7.73931 16.2607 8.93273 16.7553 10.4549C17 11.2081 17 12.1387 17 14C17 15.3728 17 16.2393 16.9018 16.9018C16.8669 17.1375 16.8195 17.3474 16.7553 17.5451C16.2607 19.0673 15.0673 20.2607 13.5451 20.7553C12.7919 21 11.8613 21 10 21C8.13872 21 7.20808 21 6.45492 20.7553C4.93273 20.2607 3.73931 19.0673 3.24472 17.5451C3 16.7919 3 15.8613 3 14Z"
            fill="currentColor"
         />
         <path
            d="M16.9018 16.9018C17.1375 16.8669 17.3474 16.8195 17.5451 16.7553C19.0673 16.2607 20.2607 15.0673 20.7553 13.5451C21 12.7919 21 11.8613 21 10C21 8.13872 21 7.20808 20.7553 6.45492C20.2607 4.93273 19.0673 3.73931 17.5451 3.24472C16.7919 3 15.8613 3 14 3C12.1387 3 11.2081 3 10.4549 3.24472C8.93273 3.73931 7.73931 4.93273 7.24472 6.45492C7.18049 6.65258 7.13312 6.86246 7.09819 7.09819M16.9018 16.9018C17 16.2393 17 15.3728 17 14C17 12.1387 17 11.2081 16.7553 10.4549C16.2607 8.93273 15.0673 7.73931 13.5451 7.24472C12.7919 7 11.8613 7 10 7C8.6272 7 7.76066 7 7.09819 7.09819M16.9018 16.9018C16.8669 17.1375 16.8195 17.3474 16.7553 17.5451C16.2607 19.0673 15.0673 20.2607 13.5451 20.7553C12.7919 21 11.8613 21 10 21C8.13872 21 7.20808 21 6.45492 20.7553C4.93273 20.2607 3.73931 19.0673 3.24472 17.5451C3 16.7919 3 15.8613 3 14C3 12.1387 3 11.2081 3.24472 10.4549C3.73931 8.93273 4.93273 7.73931 6.45492 7.24472C6.65258 7.18049 6.86246 7.13312 7.09819 7.09819"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   ),
   trash: (props: IconProps) => (
      <svg
         width="24"
         height="24"
         viewBox="0 0 24 24"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         {...props}
      >
         <path
            d="M16 6L14.8944 3.78885C14.3463 2.69253 13.2257 2 12 2C10.7743 2 9.65374 2.69253 9.10557 3.78885L8 6M4 6H20M6 6H18V15C18 16.8638 18 17.7957 17.6955 18.5307C17.2895 19.5108 16.5108 20.2895 15.5307 20.6955C14.7956 21 13.8638 21 12 21C10.1362 21 9.20435 21 8.46927 20.6955C7.48915 20.2895 6.71046 19.5108 6.30448 18.5307C6 17.7957 6 16.8638 6 15V6Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   ),
   github: (props: IconProps) => (
      <svg
         viewBox="0 0 256 250"
         width="256"
         height="250"
         fill="currentColor"
         xmlns="http://www.w3.org/2000/svg"
         preserveAspectRatio="xMidYMid"
         {...props}
      >
         <path d="M128.001 0C57.317 0 0 57.307 0 128.001c0 56.554 36.676 104.535 87.535 121.46 6.397 1.185 8.746-2.777 8.746-6.158 0-3.052-.12-13.135-.174-23.83-35.61 7.742-43.124-15.103-43.124-15.103-5.823-14.795-14.213-18.73-14.213-18.73-11.613-7.944.876-7.78.876-7.78 12.853.902 19.621 13.19 19.621 13.19 11.417 19.568 29.945 13.911 37.249 10.64 1.149-8.272 4.466-13.92 8.127-17.116-28.431-3.236-58.318-14.212-58.318-63.258 0-13.975 5-25.394 13.188-34.358-1.329-3.224-5.71-16.242 1.24-33.874 0 0 10.749-3.44 35.21 13.121 10.21-2.836 21.16-4.258 32.038-4.307 10.878.049 21.837 1.47 32.066 4.307 24.431-16.56 35.165-13.12 35.165-13.12 6.967 17.63 2.584 30.65 1.255 33.873 8.207 8.964 13.173 20.383 13.173 34.358 0 49.163-29.944 59.988-58.447 63.157 4.591 3.972 8.682 11.762 8.682 23.704 0 17.126-.148 30.91-.148 35.126 0 3.407 2.304 7.398 8.792 6.14C219.37 232.5 256 184.537 256 128.002 256 57.307 198.691 0 128.001 0Zm-80.06 182.34c-.282.636-1.283.827-2.194.39-.929-.417-1.45-1.284-1.15-1.922.276-.655 1.279-.838 2.205-.399.93.418 1.46 1.293 1.139 1.931Zm6.296 5.618c-.61.566-1.804.303-2.614-.591-.837-.892-.994-2.086-.375-2.66.63-.566 1.787-.301 2.626.591.838.903 1 2.088.363 2.66Zm4.32 7.188c-.785.545-2.067.034-2.86-1.104-.784-1.138-.784-2.503.017-3.05.795-.547 2.058-.055 2.861 1.075.782 1.157.782 2.522-.019 3.08Zm7.304 8.325c-.701.774-2.196.566-3.29-.49-1.119-1.032-1.43-2.496-.726-3.27.71-.776 2.213-.558 3.315.49 1.11 1.03 1.45 2.505.701 3.27Zm9.442 2.81c-.31 1.003-1.75 1.459-3.199 1.033-1.448-.439-2.395-1.613-2.103-2.626.301-1.01 1.747-1.484 3.207-1.028 1.446.436 2.396 1.602 2.095 2.622Zm10.744 1.193c.036 1.055-1.193 1.93-2.715 1.95-1.53.034-2.769-.82-2.786-1.86 0-1.065 1.202-1.932 2.733-1.958 1.522-.03 2.768.818 2.768 1.868Zm10.555-.405c.182 1.03-.875 2.088-2.387 2.37-1.485.271-2.861-.365-3.05-1.386-.184-1.056.893-2.114 2.376-2.387 1.514-.263 2.868.356 3.061 1.403Z" />
      </svg>
   ),
}
