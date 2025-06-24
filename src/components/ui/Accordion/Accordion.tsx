import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  icon?: React.ReactNode;
}

interface AccordionProps {
  children: React.ReactNode;
  allowMultiple?: boolean;
  defaultOpenItems?: number[];
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  isOpen = false,
  onToggle,
  icon
}) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className={`w-full px-6 py-4 text-left flex items-center justify-between transition-all duration-200 ${
          isOpen 
            ? 'bg-primary-50 border-b border-gray-200' 
            : 'bg-white hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center space-x-3">
          {icon && (
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              isOpen ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'
            }`}>
              {icon}
            </div>
          )}
          <span className={`font-semibold transition-colors ${
            isOpen ? 'text-primary-700' : 'text-gray-900'
          }`}>
            {title}
          </span>
        </div>
        <div className={`transition-transform duration-200 ${
          isOpen ? 'rotate-90' : ''
        }`}>
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </div>
      </button>
      
      <div className={`transition-all duration-300 ease-in-out ${
        isOpen 
          ? 'max-h-[2000px] opacity-100' 
          : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="px-6 py-4 bg-white border-t border-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
};

export const Accordion: React.FC<AccordionProps> = ({
  children,
  allowMultiple = false,
  defaultOpenItems = []
}) => {
  const [openItems, setOpenItems] = useState<Set<number>>(
    new Set(defaultOpenItems)
  );

  const toggleItem = (index: number) => {
    setOpenItems(prev => {
      const newOpenItems = new Set(prev);
      
      if (newOpenItems.has(index)) {
        newOpenItems.delete(index);
      } else {
        if (!allowMultiple) {
          newOpenItems.clear();
        }
        newOpenItems.add(index);
      }
      
      return newOpenItems;
    });
  };

  return (
    <div className="space-y-4">
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child) && child.type === AccordionItem) {
          return React.cloneElement(child, {
            isOpen: openItems.has(index),
            onToggle: () => toggleItem(index)
          } as AccordionItemProps);
        }
        return child;
      })}
    </div>
  );
};