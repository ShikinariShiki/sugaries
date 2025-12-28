import { useSession } from "next-auth/react"

// ... (previous imports)

export default function LetterClientView({ letterId, isAdminView = false }: { letterId: string, isAdminView?: boolean }) {
  const { data: session } = useSession() // Get session for personalized greeting
  const { state, verifyName, openEnvelope, verifyPin } = useLetterReveal(letterId, isAdminView)

    // ... (existing state)

    // ... (in PIN_CHECK render)
    < p className = "text-gray-500 mb-8 font-poppins" >
      Please enter the { state.pinLength || 4
} -digit code to read the letter
                </p >

                <PINInput
                  value={pinInput}
                  onChange={(value) => {
                    setPinInput(value)
                  }}
                  maxLength={state.pinLength || 4} // Dynamic max length
                  error={!!state.error}
                />

// ... (in READING render)
                        <h2 className="text-3xl md:text-5xl font-handwriting font-bold text-gray-900 leading-tight">
                          Dear {session?.user?.name || state.recipientName},
                        </h2>
                      </div >
  <div className="w-16 h-16 bg-white/40 rounded-full flex items-center justify-center border border-white/60">
    <Heart size={32} className="text-pink-500 fill-pink-400/30" />
  </div>
                    </header >

  {/* Image if provided */ }
{
  state.imageUrl && (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="mb-10 group cursor-zoom-in"
      onClick={() => setIsLightboxOpen(true)}
    >
      <div className="p-2 bg-white/50 backdrop-blur-sm rounded-3xl shadow-lg border border-white/80 overflow-hidden relative">
        <img
          src={state.imageUrl}
          alt="Letter attachment"
          className="w-full h-auto object-contain rounded-2xl max-h-[500px]"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Eye className="text-white drop-shadow-lg" size={48} />
        </div>
      </div>
    </motion.div>
  )
}

                    <div
                      className={cn(
                        "prose prose-xl max-w-none text-gray-800 leading-[1.8] whitespace-pre-wrap",
                        fontClass,
                        "text-2xl md:text-3xl"
                      )}
                    >
                      {state.content}
                    </div>

                    <footer className="mt-16 pt-10 border-t border-black/5">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left">
                          <p className="text-[10px] uppercase tracking-[0.2em] font-black text-black/20 mb-1">Delivered on</p>
                          <p className="text-gray-500 text-sm font-medium italic">
                            {new Date().toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>

                        <SquishButton
                          onClick={() => setShowReplyModal(true)}
                          variant="secondary"
                          size="lg"
                          className="w-full md:w-auto px-10 py-4 rounded-2xl bg-white hover:bg-white text-gray-800 border-none shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 transition-all"
                        >
                          <Send size={20} />
                          <span>Reply to Letter</span>
                        </SquishButton>
                      </div>
                    </footer>
                  </motion.div >
                </PaperCard >
              </div >
            </motion.div >
          </>
        )}
      </AnimatePresence >

      <AnimatePresence>
        {isLightboxOpen && state.imageUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 md:p-8"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 md:top-8 md:right-8 text-white/50 hover:text-white transition-colors p-2"
            >
              <X size={32} />
            </button>

            {/* Download Button */}
            <a
              href={state.imageUrl}
              download={`letter-attachment-${letterId}.png`}
              onClick={(e) => e.stopPropagation()}
              className="absolute top-4 left-4 md:top-8 md:left-8 text-white/50 hover:text-white transition-colors p-2 flex items-center gap-2 group"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download size={24} />
              <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">Download</span>
            </a>

            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={state.imageUrl}
              alt="Full size attachment"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showReplyModal && (
          <ReplyModal
            recipientName={state.recipientName || ''}
            onClose={() => setShowReplyModal(false)}
          />
        )}
      </AnimatePresence>
    </div >
  )
}
