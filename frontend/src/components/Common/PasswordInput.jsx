import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

/**
 * PasswordInput — text input with a show/hide (eye) toggle.
 *
 * Drop-in replacement for <input type="password">.
 * Works both with react-hook-form ({...register('password')}) and as a
 * controlled input (value/onChange) — all props pass through to the <input>.
 *
 * forwardRef is required so react-hook-form's ref reaches the real <input>
 * (it uses that ref to read values and focus fields on validation errors).
 */
export const PasswordInput = forwardRef(function PasswordInput(props, ref) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <input
        ref={ref}
        type={visible ? 'text' : 'password'}
        className="input-field pr-10"
        {...props}
      />
      <button
        type="button" /* not "submit" — must never submit the form */
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1} /* keep Tab moving between fields, not onto the eye */
        title={visible ? 'Hide password' : 'Show password'}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
      >
        {visible ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </div>
  )
})
